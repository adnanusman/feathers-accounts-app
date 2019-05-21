import React, {Component} from 'react';
import Chart from 'chart.js';

class Stats extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.userId = this.userId;

    this.renderChart = this.renderChart.bind(this);

    this.state = {

    }
  }

  renderChart(data, data2, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Profits',
                data: data,
                borderColor: 'rgba(75, 150, 192, 1)',
                backgroundColor: 'rgba(75, 150, 192, 0.4)',
            },
            {
                label: 'Expenses',
                data: data2,
                borderColor: '#650000',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
            }
          ]
        },
        options: {            
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return "U$ "+(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                        }
                    }
                }]                
            }
        },
    });
  }

  componentDidMount() {
    var data = [20000, 14000, 12000, 15000, 18000, 19000, 22000];
    var data2 = [20000, 44000, 1200, 15000, 8000, 9000, 22000]
    var labels =  ["January", "February", "March", "April", "June", "July", "August", "September", "October", "November", "December"];
    this.renderChart(data, data2, labels);
  }

  render() {
    return (
      <div>
        <canvas id="myChart"></canvas>
      </div>
    )
  }
}

export default Stats;