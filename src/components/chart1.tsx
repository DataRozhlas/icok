import Highcharts from 'highcharts';
import { HighchartsChart, HighchartsProvider, Chart, Legend, ColumnSeries, XAxis, YAxis, Tooltip } from "react-jsx-highcharts";


type PropsType = {
    data: string[][];
    type: string;
    color: string;

}

function Chart1(props: PropsType) {
    //process data
    const years = props.data.find((row) => row[0] === 'Směr')?.slice(1).map((year) => year);
    const data = props.data.find((row) => row[0] === props.type)?.slice(1).map((value) => parseFloat(value));
    const complementary = data?.map((value) => 100 - value) ?? [];

    return (
        <HighchartsProvider Highcharts={Highcharts}>
            <h3 className="">{props.type}</h3>

            <HighchartsChart plotOptions={{
                column: {
                    pointPadding: 0,
                    groupPadding: 0.05,
                    stacking: 'normal',
                },
                series: {
                    animation: false,
                    states: { hover: { enabled: false } }, // disable hover
                }
            }}> <Chart height={210} />

                <Legend layout="horizontal" align="center" verticalAlign="top" reversed={true} symbolRadius={2} />

                <Tooltip shared valueSuffix=' %' formatter={function () {
                    const highTechPoint = this.points?.find(point => point.series.name === 'high-tech');
                    if (highTechPoint) {
                        return `<strong>${this.point.category}</strong> ${props.type} ${highTechPoint.series.name}: ${highTechPoint.y?.toLocaleString("cs-CZ")} %`;
                    }
                    return '';
                }} />

                <XAxis categories={years} crosshair={true} labels={{ rotation: -45 }} />


                <YAxis max={100} labels={{ formatter: function () { return this.isLast ? `${this.value.toString()} %` : this.value.toString(); } }}>
                    <ColumnSeries name="ostatní zboží" data={complementary} color={"#f4f4f5"} />
                    <ColumnSeries name="high-tech" data={data} color={props.color} dataLabels={{
                        enabled: true,
                        inside: false,
                        allowOverlap: true,
                        crop: false,
                        color: 'black',
                        rotation: 270,
                        formatter: function () {
                            if (this.point.index === 0 || this.point.index === this.series.data.length - 1) {
                                return `${Math.floor(this?.point?.y ?? 0)} %`
                            }

                            return ""
                        }
                    }
                    } />

                </YAxis>
            </HighchartsChart>
        </HighchartsProvider >
    );
}

export default Chart1;