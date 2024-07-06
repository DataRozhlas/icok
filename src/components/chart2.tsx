import Highcharts from 'highcharts';
import HighchartsSeriesLabel from 'highcharts/modules/series-label';
import { HighchartsChart, HighchartsProvider, Chart, Legend, AreaSeries, XAxis, YAxis, Tooltip } from "react-jsx-highcharts";

// Initialize the series-label module
HighchartsSeriesLabel(Highcharts);

Highcharts.setOptions({
    lang: {
        numericSymbols: [" tis.", " mil.", " mld.", " bil."],
    }
});


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
        return isNaN(parseFloat(value.replace(',', ''))) ? 0 : parseFloat(value.replace(',', '')) / 1000
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

    const colors = props.selected === "Elektronické a telekomunikační zboží" ? ["#f18d21", "#f37978", "#19979d", "#284f72"] : ["#f18d21", "#284f72", "#19979d", "#6e557c", "#ba5b8d", "#f37978"]

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

                <Legend layout="horizontal" align="center" verticalAlign="bottom" reversed={true} symbolRadius={2} squareSymbol={true} />

                <Tooltip split={false} shared valueDecimals={1} valueSuffix={props.view === "rel" ? " %" : " mld. Kč"} />

                <XAxis tickWidth={1} min={1993} max={2023} crosshair={true} />


                <YAxis labels={{ formatter: function () { return this.isLast ? props.view === "rel" ? `${this.value.toString()} %` : `${this.value.toLocaleString("cs-CZ")} mld. Kč` : this.value.toLocaleString("cs-CZ"); } }}>
                    {data.reverse().map((item, index) => {
                        return <AreaSeries key={item.name} name={item.name} data={item.data} color={colors[index]}
                        />
                    })}
                </YAxis>
            </HighchartsChart>
        </HighchartsProvider >
    );
}

export default Chart2;