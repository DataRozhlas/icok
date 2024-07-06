import Highcharts from 'highcharts';
import HighchartsAnnotations from 'highcharts/modules/annotations';
import { HighchartsChart, HighchartsProvider, Chart, ColumnSeries, XAxis, YAxis, Tooltip } from "react-jsx-highcharts";

HighchartsAnnotations(Highcharts);

type PropsType = {
    data: string[][];
    type: string;
    color: string;

}

const isMobile = window.innerWidth < 1024;

function Chart1(props: PropsType) {
    //process data
    const years = props.data.find((row) => row[0] === 'Směr')?.slice(1).map((year) => { return parseInt(year) }) as number[];
    const data = props.data.find((row) => row[0] === props.type)?.slice(1).map((value) => parseFloat(value));
    const processedData = data?.map((item, index) => { return { x: years[index], y: item, color: index === 27 ? "#0c828e" : props.color } })

    return (
        <HighchartsProvider Highcharts={Highcharts}>
            <h3 className="">{props.type}</h3>
            <HighchartsChart
                plotOptions={{
                    column: {
                        pointPadding: 0,
                        groupPadding: 0,
                        stacking: 'normal',
                    },
                    series: {
                        animation: false,
                        states: { hover: { enabled: false } }, // disable hover
                    }
                }}
                annotations={[{
                    labels: isMobile ? [] : [
                        {
                            point: { x: 281, y: props.type === "Vývoz" ? 140 : 125, xAxis: 0, yAxis: 0 },
                            text: 'Dosavadní maximum<br> (ovlivněno covidem)',
                            align: 'right',
                            x: -10,
                            y: 0,
                            style: { fontSize: '0.65em' }
                        },
                    ]
                }]}

            >
                <Chart
                    height={300}
                    yAxis={{ min: 0, max: 50 }}
                    xAxis={{ min: 1993, max: 2023 }}
                    animation={false} />

                {/* <Legend layout="horizontal" align="center" verticalAlign="top" reversed={true} symbolRadius={2} /> */}

                <Tooltip shared
                    valueSuffix=' %'
                    formatter={function () {
                        const highTechPoint = this.points?.find(point => point.series.name === 'high-tech');
                        if (highTechPoint) {
                            return `<strong>${this.point.category}</strong> ${props.type} ${highTechPoint.series.name}: ${highTechPoint.y?.toLocaleString("cs-CZ")} %`;
                        }
                        return '';
                    }} />

                <XAxis
                    id={"rok"}
                    crosshair={true}
                    min={1993}
                    max={2023}
                    labels={{ rotation: 0 }} />


                <YAxis
                    opposite={!isMobile && props.type === "Dovoz"}
                    id={"podil"}
                    max={50}
                    tickPositions={[0, 25, 50]}
                    labels={{
                        formatter: function () {
                            return this.isLast ? `${this.value.toString()} %` : this.value.toString();
                        }
                    }}>
                    {/* <ColumnSeries name="ostatní zboží" data={complementary.map((item, index) => { return { x: years[index], y: item } })} color={"#f4f4f5"} /> */}
                    <ColumnSeries
                        name="high-tech"
                        color={props.color}
                        data={processedData}
                        dataLabels={{
                            enabled: true,
                            inside: false,
                            allowOverlap: true,
                            crop: false,
                            color: 'black',
                            rotation: 270,
                            style: {
                                fontSize: '0.65em',
                            },
                            formatter: function () {
                                if (this.point.index === 0 || this.point.index === this.series.data.length - 1) {
                                    return `${Math.floor(this?.point?.y ?? 0)} %`
                                }
                                // if (this.point.index === 27) {
                                //     return `maximum`
                                // }

                                return ""
                            }
                        }
                        } />

                </YAxis>
            </HighchartsChart>
        </HighchartsProvider>
    );
}

export default Chart1;