import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { fetchCoinHistory } from "../api";
import { isDarkAtom } from "../atoms";

interface ChartProps {
    coinId: string;
}
interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}
interface IPriceProps {
}
function Price({ }: IPriceProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const props = useOutletContext<ChartProps>();
    const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", props.coinId], () => fetchCoinHistory(props.coinId),
        {
            refetchInterval: 10000,
        });
    return (
        <>
            <div>{isLoading ? "Loading chart..." :

                <ReactApexChart type="line"
                    series={[{
                        name: "candlestick",
                        type: 'candlestick',
                        data: data?.map((price) => [
                            price.time_close,
                            price.open,
                            price.high,
                            price.low,
                            price.close,
                        ]) as unknown as number[]
                    }]}
                    options={{
                        theme: {
                            mode: isDark ? "dark" : "light"
                        },
                        chart: {
                            height: 300,
                            type: 'candlestick',
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent"

                        },
                        xaxis: {
                            type: 'datetime',
                            labels: {
                                show: false
                            },
                            axisBorder: {
                                show: false
                            }, axisTicks: {
                                show: false
                            },
                            categories: data?.map((date) => date.time_close)
                        },
                        yaxis: {
                            opposite: true,
                            show: false,
                        },
                        grid: {
                            show: false
                        },
                        tooltip: {
                            enabled: true,
                            shared: true,
                            intersect: false,
                            onDatasetHover: {
                                highlightDataSeries: true,
                            },
                            custom: [function ({ seriesIndex, dataPointIndex, w }) {
                                var date = new Date(w.globals.lastXAxis.categories[dataPointIndex])
                                var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex].toFixed(3)
                                var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex].toFixed(3)
                                var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex].toFixed(3)
                                var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex].toFixed(3)
                                return (
                                    '<div class="apexcharts-tooltip-title" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">' +
                                    date.getDate() + " " + w.globals.locale.shortMonths[date.getMonth()] +
                                    '</div>' +
                                    '<div class="apexcharts-tooltip-series-group apexcharts-active" style="order:1; display:flex;>' +
                                    '<div class="apexcharts-tooltip-text">' +
                                    '<div class="apexcharts-tooltip-candlestick" style="font-family: Helvetica, Arial, sans-serif; font-size: 12px;">' +
                                    '<div class="apexcharts-tooltip-y-gruop">' +
                                    '<span class="apexcharts-tooltip-text-y-label"> Open: </span> <span class="apexcharts-tooltip-text-y-value">' +
                                    o +
                                    '</span></div>' +
                                    '<div class="apexcharts-tooltip-y-gruop">' +
                                    '<span class="apexcharts-tooltip-text-y-label"> High: </span> <span class="apexcharts-tooltip-text-y-value">' +
                                    h +
                                    '</span></div>' +
                                    '<div class="apexcharts-tooltip-y-gruop">' +
                                    '<span class="apexcharts-tooltip-text-y-label"> Low: </span> <span class="apexcharts-tooltip-text-y-value">' +
                                    l +
                                    '</span></div>' +
                                    '<div class="apexcharts-tooltip-y-gruop">' +
                                    '<span class="apexcharts-tooltip-text-y-label"> Close: </span> <span class="apexcharts-tooltip-text-y-value">' +
                                    c +
                                    '</span></div>' +
                                    '</div></div></div>'
                                )
                            }],
                        },
                        stroke: {
                            show: true,
                            width: 3,
                        }
                    }}
                />
            }</div>
        </>
    );
}
export default Price;