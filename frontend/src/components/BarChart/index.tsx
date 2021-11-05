import axios from 'axios';
import { round } from 'pages/utils/format';
import { BASE_URL } from 'pages/utils/requests';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { SaleSuccess } from 'types/sale';

type SeriesData = {
    name: string
    data: number[]
}

type ChartData = {
    labels: {
        categories: string[]
    }
    series: SeriesData[]
}

function BarChart() {

    const [chartData, setChartData] = useState<ChartData>({
        labels: { categories: [] },
        series: [{ name: "", data: [] }]
    })

    useEffect(() => {
        axios.get(`${BASE_URL}/sales/success-by-seller`)
            .then(response => {
                const data = response.data as SaleSuccess[]
                const myLabels = data.map(x => x.sellerName)
                const mySeries = data.map(x => round(100.0 * x.deals / x.visited, 1))

                setChartData({
                    labels: { categories: myLabels },
                    series: [{ name: "% Sucesso", data: mySeries }]
                })
            })
    }, [])

    const options = {
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
    };

    return (
        <div>
            <Chart 
            options={{...options, xaxis: chartData.labels}}
            series={chartData.series}
            type="bar"
            height="240"
            />
        </div>
    );
}

export default BarChart;