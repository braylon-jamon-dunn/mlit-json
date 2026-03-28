import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const rawDir = resolve(root, 'raw/UTF-8')
const dataDir = resolve(root, 'data')

mkdirSync(dataDir, { recursive: true })

// Read GeoJSON files
const stationsGeo = JSON.parse(readFileSync(resolve(rawDir, 'N02-24_Station.geojson'), 'utf-8'))
const sectionsGeo = JSON.parse(readFileSync(resolve(rawDir, 'N02-24_RailroadSection.geojson'), 'utf-8'))

// Round coordinate to 6 decimal places
function round(n: number): number {
  return Math.round(n * 1e6) / 1e6
}

// Process stations
interface Station {
  name: string
  lng: number
  lat: number
  line: string
  operator: string
  type: number
}

const stations: Station[] = stationsGeo.features
  .map((f: any) => {
    const p = f.properties
    // Station geometries are LineStrings — take the midpoint
    const coords: number[][] = f.geometry.coordinates
    const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length
    const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length
    return {
      name: p.N02_005,
      lng: round(lng),
      lat: round(lat),
      line: p.N02_003,
      operator: p.N02_004,
      type: Number(p.N02_001),
    }
  })
  .filter((s: Station) => s.name) // skip entries without station name
  .sort((a: Station, b: Station) =>
    a.operator.localeCompare(b.operator, 'ja')
    || a.line.localeCompare(b.line, 'ja')
    || a.name.localeCompare(b.name, 'ja'),
  )

// Process lines (grouped from stations)
interface Line {
  name: string
  operator: string
  type: number
  stations: string[]
}

const lineMap = new Map<string, Line>()
for (const s of stations) {
  const key = `${s.operator}\0${s.line}`
  if (!lineMap.has(key)) {
    lineMap.set(key, {
      name: s.line,
      operator: s.operator,
      type: s.type,
      stations: [],
    })
  }
  const line = lineMap.get(key)!
  if (!line.stations.includes(s.name))
    line.stations.push(s.name)
}

const lines = [...lineMap.values()].sort((a, b) =>
  a.operator.localeCompare(b.operator, 'ja')
  || a.name.localeCompare(b.name, 'ja'),
)

// Process sections
interface Section {
  line: string
  operator: string
  type: number
  coordinates: number[][] | number[][][]
}

const sections: Section[] = sectionsGeo.features.map((f: any) => {
  const p = f.properties
  const coords = f.geometry.type === 'MultiLineString'
    ? f.geometry.coordinates.map((ring: number[][]) => ring.map(([lng, lat]: number[]) => [round(lng), round(lat)]))
    : f.geometry.coordinates.map(([lng, lat]: number[]) => [round(lng), round(lat)])
  return {
    line: p.N02_003,
    operator: p.N02_004,
    type: Number(p.N02_001),
    coordinates: coords,
  }
})

// Write output
writeFileSync(resolve(dataDir, 'stations.json'), JSON.stringify(stations, null, 2) + '\n')
writeFileSync(resolve(dataDir, 'lines.json'), JSON.stringify(lines, null, 2) + '\n')
writeFileSync(resolve(dataDir, 'sections.json'), JSON.stringify(sections, null, 2) + '\n')

console.log(`Processed: ${stations.length} stations, ${lines.length} lines, ${sections.length} sections`)
