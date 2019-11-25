var express = require('express');
var router = express.Router();
const { CanvasRenderService } = require('chartjs-node-canvas');
const chartDataLabelsPlugin = require('chartjs-plugin-datalabels');
const applicantsByDepartment = [
  { department: 'department1', amount: 15 },
  { department: 'department2', amount: 8 },
  { department: 'department3', amount: 12 },
  { department: 'department4', amount: 5 }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  const chart = createApplicantsByDepartmentChart(applicantsByDepartment);
  console.log(chart);
});

const chartType = 'doughnut';
const chartWidth = 302;
const chartHeight = 302;
const chartFontSize = 12;
const displayLegend = false;

const chartColors = ['#FF7775', '#1898C2', '#1A2D3A', '#115C87'];

const createApplicantsByDepartmentChart = async applicantsByDepartment => {
  const canvasRenderService = new CanvasRenderService(
    chartWidth,
    chartHeight,
    chartCallback
  );
  try {
    return canvasRenderService.renderToBuffer(
      getConfiguration(applicantsByDepartment),
      'image/png'
    );
  } catch (e) {
    console.log(e);
  }
};

const chartCallback = ChartJS => {
  ChartJS.plugins.register(chartDataLabelsPlugin);
};

const getConfiguration = applicantsByDepartment => {
  const amountOfApplications = applicantsByDepartment.map(dp => dp.amount);
  const applicantByDepartmentColors = amountOfApplications.map(
    (amount, i) => chartColors[i]
  );

  return {
    type: chartType,
    data: {
      labels: [' ', ' ', ' ', ' '],
      datasets: [
        {
          data: amountOfApplications,
          backgroundColor: applicantByDepartmentColors,
          borderColor: applicantByDepartmentColors,
          borderWidth: 1,
          datalabels: {
            color: amountOfApplications.map(amount => '#FFFFFF'),
            font: {
              size: chartFontSize,
              weight: 'bold'
            },
            align: 'center',
            anchor: 'center',
            rotation: 5
          }
        }
      ]
    },
    options: {
      legend: {
        display: displayLegend
      },
      plugins: {
        datalabels: {
          formatter: value => {
            return `${value}%`;
          }
        }
      }
    }
  };
};

module.exports = router;
