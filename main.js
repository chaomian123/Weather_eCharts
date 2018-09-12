const log = console.log.bind(console)
const e = sel => document.querySelector(sel)

const insertHTML = () => {
    let t = `
                <div id="main" style="width: 600px; height: 400px;"></div>
            `
    let body = e('body')
    body.insertAdjacentHTML('beforeend', t)
}
const ajax = function(request, callback) {
    let r = new XMLHttpRequest()
    r.open(request.method, request.path, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            callback(r.response)
        }
    }
    r.send(request.data)
}


const fetchWeather = () => {
    let location = 'nanjing'
    let url = `https://free-api.heweather.com/s6/weather/forecast?location=${location}&key=`
    let req = {
        method: 'GET',
        path: url,
        data: '',
    }
    ajax(req, (r) => {
        let t = JSON.parse(r)
        log(t)
        initialData(t)
    })
}
const o = {}

const initialData = (data) => {
    data = data.HeWeather6[0].daily_forecast

    let o = {
        date: [],
        min: [],
        max: [],
        pop: [],
    }
    for (let r of data) {
        let date = r.date
        let min = r.tmp_min
        let max = r.tmp_max
        let pop = r.pop
        o.date.push(date)
        o.min.push(min)
        o.max.push(max)
        o.pop.push(pop)
    }
    insertHTML()
    let myChart = echarts.init(document.querySelector('#main'), 'vintage');
    let option = {
        title: {
            text: '南京近三日天气'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['降水概率', '最高温度', '最低温度']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: o.date
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '降水概率',
                type: 'bar',
                barWidth: 15,
                data: o.pop
            },
            {
                name: '最高温度',
                type: 'bar',
                // stack: '气温',
                data: o.max
            },
            {
                name: '最低温度',
                type: 'bar',
                // stack: '气温',
                data: o.min
            },
        ]
    }

    myChart.setOption(option)

}



const __main = () => {
    fetchWeather()
}

__main()
