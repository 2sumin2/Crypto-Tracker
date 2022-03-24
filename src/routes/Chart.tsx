import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
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
interface IChartProps {
}
function Chart({ }: IChartProps) {
    const isDark = useRecoilValue(isDarkAtom);
    const props = useOutletContext<ChartProps>();
    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", props.coinId],
        () => fetchCoinHistory(props.coinId),
        {
            refetchInterval: 10000,
        });
    return (
        <>
            <div>{isLoading ? "Loading chart..." :
                <ReactApexChart type="line"
                    series={
                        [{
                            name: "line",
                            type: 'line',
                            data: data?.map((price) => price.close) as number[],
                        }]}
                    options={{
                        theme: {
                            mode: isDark ? "dark" : "light"
                        },
                        chart: {
                            height: 300,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent"
                        },
                        grid: {
                            show: false
                        },
                        stroke: {
                            curve: "smooth",
                        },
                        xaxis: {
                            labels: {
                                show: false
                            },
                            axisTicks: {
                                show: false
                            },
                            axisBorder: {
                                show: false
                            },
                            type: 'datetime',
                            categories: data?.map((date) => date.time_close)
                        },
                        yaxis: {
                            show: false
                        },
                        fill: {
                            type: "gradient",
                            gradient: {
                                gradientToColors: ["#00cec9"],
                                stops: [0, 100]
                            },
                        },
                        colors: ["#e84393"],
                        tooltip: {
                            y: {
                                title: {
                                    formatter: (seriesName) => ""
                                },
                                formatter: (value) => `$ ${value.toFixed(2)}`
                            },
                            marker: {
                                show: false,
                            },
                        }
                    }}
                />
            }</div>
        </>
    );
}
export default Chart;
