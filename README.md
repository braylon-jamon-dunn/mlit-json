# mlit-json

Processed [MLIT 国土数値情報](https://nlftp.mlit.go.jp/ksj/) N02 Railway Data (2024) as clean JSON.

## Data

- **`data/stations.json`** — Railway stations (name, coordinates, line, operator)
- **`data/lines.json`** — Railway lines with grouped station lists
- **`data/sections.json`** — Railroad section geometries (LineString coordinates)

## Data Source

> 国土交通省 国土数値情報「鉄道データ（N02）」（令和6年）
> https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2024.html

This data is provided by the Ministry of Land, Infrastructure, Transport and Tourism (MLIT) of Japan under the [国土数値情報利用約款](https://nlftp.mlit.go.jp/ksj/other/yakkan.html).

## Disclaimer

This data is provided as-is for convenience. It may not reflect the latest state of Japan's railway network. For authoritative data, refer to the [original source](https://nlftp.mlit.go.jp/ksj/).

## Update

```bash
pnpm install
pnpm run update
```

## License

Code in this repository is licensed under [MIT](./LICENSE). The railway data is subject to [MLIT's terms of use](https://nlftp.mlit.go.jp/ksj/other/yakkan.html).
