import React, {Component} from 'react';
import Chart from 'chart.js';
import Accounting from 'accounting';

class Stats extends Component {
  constructor(props) {
    super(props);

    this.client = this.props.client;
    this.userId = this.props.userId;

    this.renderChart = this.renderChart.bind(this);
    this.genEntries = this.getEntries.bind(this);

    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  componentWillMount() {
    this.getEntries();
  }

  async getEntries() {
    let income = [];
    let expense = [];

    await this.client.service('entries')
      .find({
        query: {
          personId: {
            $eq: this.userId
          }
        }
      })
      .then(response => {
        return response.data.map(entry => {
          let type = entry.type;
          // get the month.. returns 0 - 11
          let month = new Date(entry.createdAt).getMonth();
          let amount = +entry.amount;

          // create array with 12 months income/expenses consolidated into one amount per month.
          for(var i = 0; i < 12; i++) {
            if(month === i) {
              if(type === 'Income') {
                if(income[i] === undefined) {
                  income[i] = amount;
                } else {
                  income[i] = income[i] + amount;
                }
              } else {
                if(expense[i] === undefined) {
                  expense[i] = amount;
                } else {
                  expense[i] = expense[i] + amount;
                }
              }
            } else {
              // if no income or expense for that month, mark it as 0
              if(income[i] === undefined) {
                income[i] = 0;
              }

              if(expense[i] === undefined) {
                expense[i] = 0;
              }
            }
          }
        })
      })
      
      this.renderChart({income, expense});
  }

  renderChart(data) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: this.months,
            datasets: [{
                label: 'Income',
                data: data.income,
                borderColor: 'rgba(75, 150, 192, 1)',
                backgroundColor: 'rgba(75, 150, 192, 0.4)',
            },
            {
                label: 'Expenses',
                data: data.expense,
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
                            return Accounting.formatMoney(value, '$', 0);
                        }
                    }
                }]
            }
        },
    });
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