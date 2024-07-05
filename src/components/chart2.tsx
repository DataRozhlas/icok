import Highcharts from 'highcharts';
import { HighchartsChart, HighchartsProvider, Chart, Legend, AreaSeries, XAxis, YAxis, Tooltip } from "react-jsx-highcharts";



type PropsType = {
    data: string[][];
    type: string;

}


function Chart2(props: PropsType) {
    //process data
    const years = props.data.find((row) => row[0] === 'Směr')?.slice(3).map((year) => year);
    const data = props.data.filter((row) => row[0] === props.type).map((row) => row.map((value, index) => {
        if (index < 3) return value;
        return isNaN(parseFloat(value.replace(',', ''))) ? 0 : parseFloat(value.replace(',', ''))
    }));
    const cleanData = data.reduce((acc: any[], row: any[]): any[] => {
        const clean = row.slice(3)
        const existing = acc.find(item => item.name === row[1]);
        if (existing) {
            existing.data = existing.data.map((value: number, index: number) => value + clean[index]);
            const newAcc = [...acc.filter(item => item.name !== row[1]), existing];
            return newAcc
        }
        const newAcc = [...acc, { name: row[1], data: clean, drilldown: row[1] }];
        return newAcc;
    }, []);

    const drilldownData = cleanData.map((item) => {
        return { id: item.name, name: item.name, type: "area", data: data.filter((row) => row[1] === item.name).map((row) => row.slice(2)) }

    })

    console.log("drill", drilldownData, "clean", cleanData)

    return (
        <HighchartsProvider Highcharts={Highcharts}>
            <h3 className="">{props.type}</h3>

            <HighchartsChart
                plotOptions={{
                    area: {
                        stacking: 'percent',
                    },
                    series: {
                        animation: false,
                        states: { hover: { enabled: false } }, // disable hover
                    }
                }}
                drilldown={{
                    breadcrumbs: {
                        position: {
                            align: 'right'
                        }
                    },
                    series: [
                        { name: "Výzbroj", id: "0", type: "line", data: [1, 2, 3, 4] },
                    ]

                }}

            >

                <Chart height={450} />

                <Legend layout="horizontal" align="center" verticalAlign="top" reversed={true} symbolRadius={2} />

                <Tooltip shared valueSuffix=' %' formatter={function () {
                    const highTechPoint = this.points?.find(point => point.series.name === 'high-tech');
                    if (highTechPoint) {
                        return `<strong>${this.point.category}</strong> ${props.type} ${highTechPoint.series.name}: ${highTechPoint.y?.toLocaleString("cs-CZ")} %`;
                    }
                    return '';
                }} />

                <XAxis categories={years} crosshair={true} labels={{ rotation: -45 }} />


                <YAxis labels={{ formatter: function () { return this.isLast ? `${this.value.toString()} %` : this.value.toString(); } }}>
                    {cleanData.reverse().map((item, index) => (
                        <AreaSeries key={item.name} name={item.name} drilldown={"0"} data={item.data} />
                    ))}
                </YAxis>
            </HighchartsChart>
        </HighchartsProvider >
    );
}

export default Chart2;