import Highcharts from 'highcharts';
import HighchartsSeriesLabel from 'highcharts/modules/series-label';
import { HighchartsChart, HighchartsProvider, Chart, Legend, AreaSeries, XAxis, YAxis, Tooltip } from "react-jsx-highcharts";

// Initialize the series-label module
HighchartsSeriesLabel(Highcharts);


type PropsType = {
    data: string[][];
    type: string;
    selected: string;
    view: string;
}


const prepareData = (data: string[][], type: string, selected: string) => {
    const years = data.find((row) => row[0] === 'Směr')?.slice(3).map((year) => year);

    const cleanData = data.filter((row) => row[0] === type).map((row) => row.map((value, index) => {
        if (index < 3) return value;
        return isNaN(parseFloat(value.replace(',', ''))) ? 0 : parseFloat(value.replace(',', ''))
    }));
    if (selected === 'all') {
        const result = cleanData.reduce((acc: any[], row: any[]): any[] => {
            const clean = row.slice(3)
            const existing = acc.find(item => item.name === row[1]);
            if (existing !== undefined) {
                existing.data = existing.data.map((value: { x: number, y: number }, index: number) => ({
                    x: value.x,
                    y: value.y + clean[index]
                }));
                const newAcc = [...acc.filter(item => item.name !== row[1]), existing];
                return newAcc
            }

            const newData = clean.map((value, index) => {
                return { x: parseInt(years?.[index] ?? ''), y: value }
            })

            const newAcc = [...acc, {
                name: row[1], data: newData
            }];

            console.log(newAcc);
            return newAcc;
        }, []);
        return result;
    }

    // single categorie
    const result = cleanData.filter((row) => row[1] === selected).map((row) => {
        return {
            name: row[2], data: row.slice(3).map((value, index) => {
                return { x: parseInt(years?.[index] ?? ''), y: value }
            })
        }
    })
    return result;
}


function Chart2(props: PropsType) {
    //process data



    const data = prepareData(props.data, props.type, props.selected);

    return (
        <HighchartsProvider Highcharts={Highcharts}>
            <h3 className="">{props.type}</h3>

            <HighchartsChart
                plotOptions={{
                    area: {
                        stacking: props.view === "rel" ? 'percent' : 'normal',
                        marker: {
                            enabled: false
                        },
                        lineColor: "white",
                        lineWidth: 1,

                    },
                    series: {
                        animation: false,
                        states: { hover: { enabled: false } },
                        label: {
                            enabled: true,
                            connectorAllowed: false
                        } // disable hover
                    }
                }}            >

                <Chart height={450} />

                <Legend layout="horizontal" align="center" verticalAlign="bottom" reversed={true} symbolRadius={2} />

                <Tooltip split={true} shared />

                <XAxis tickWidth={1} min={1993} max={2023} crosshair={true} />


                <YAxis labels={{ formatter: function () { return this.isLast ? `${this.value.toString()} %` : this.value.toString(); } }}>
                    {data.reverse().map((item) => {
                        return <AreaSeries key={item.name} name={item.name} data={item.data}
                        />
                    })}
                </YAxis>
            </HighchartsChart>
        </HighchartsProvider >
    );
}

export default Chart2;