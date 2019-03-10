import React, { Component } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { Button, Form, FormGroup, Label, Input, Jumbotron } from "reactstrap";
import  CurrencyFormat  from 'react-currency-format';/* no idea why heroku wont read this in es6 */
// try this next-- const CurrencyFormat = require('react-currency-format');




class Solar extends Component {

  state = {
    years: 0,
    totalElectric: 0,
    totalCost: 0,
    stock: 0.0811,
    bond: 0.0462,
    savings: 0.0025,
    initialIvestment: 0,
    highInitialIvestment: 0,
    formErrors: { totalElectric: '', totalCost: '' },
    formValid: false,
    totalCostValid: false,
    totalElectricValid: false,
    cdR: 0,
    bondsR: 0,
    stockR: 0,
    solarR: 0,
    solarReinvestment: 0,
    fv: 0,
    total: 0,
    payment: 0,
    data: [],
  };
  CustomToolTip = ({ payload, label, active}) =>{
    if (active && payload) {
      return (
        <div className="custom-tooltip" id="tooltipBackround">
          <p className="label" id="chartcolorLabel">{`${label}`}</p>
          <p className="label" id = "chartcolor"> Initial : <CurrencyFormat value={payload[0].value} displayType={'text'} thousandSeparator={true} prefix={'$'}/></p>
          <p className="label" id = "chartcolor2"> Return : <CurrencyFormat value={payload[1].value} displayType={'text'} thousandSeparator={true} prefix={'$'}/></p>
        </div>
      );
    }
  
    return null;
}
  changeData = () => {
    this.setState({
      data: [
        {
          "name": "CD/Savings",
          "Initial Investment": this.state.initialIvestment,
          "Return": this.state.cdR,
        },

        {
          "name": "US Bonds",
          "Initial Investment": this.state.initialIvestment,
          "Return": this.state.bondR,
        },

        {
          "name": "S&P 500",
          "Initial Investment": this.state.initialIvestment,
          "Return": this.state.stockR,
        },

        {
          "name": "Solar",
          "Initial Investment": this.state.initialIvestment,
          "Return": this.state.solarR,
        },

        {
          "name": "Solar with Reinvesment",
          "Initial Investment": this.state.initialIvestment,
          "Return": this.state.solarReinvestment,
        }
      ]
    });
  };
  findInitialInvesment = (x) => {
    let amountUsed = x;
    let panelCount = amountUsed / 365;
    let stcRating = panelCount * 250;
    let initialIvestment1 = stcRating * 2.80;
    let initialIvestment = parseFloat(parseFloat(initialIvestment1).toFixed(2));
    this.setState({ initialIvestment: initialIvestment });
  }

  returnOnInvestmentCd = (pricipal) => {
    let fv1 = pricipal * Math.pow(this.state.savings + 1, this.state.years);
    let fv = parseFloat(parseFloat(fv1).toFixed(2));
    this.setState({ cdR: fv });
  };

  returnOnInvestmentBond = (pricipal) => {
    let fv1 = pricipal * Math.pow(this.state.bond + 1, this.state.years);
    let fv = parseFloat(parseFloat(fv1).toFixed(2));
    this.setState({ bondR: fv });
  };

  returnOnInvestmentStock = (pricipal) => {
    let fv1 = pricipal * Math.pow(this.state.stock + 1, this.state.years);
    let fv = parseFloat(parseFloat(fv1).toFixed(2));
    this.setState({ stockR: fv });
  };

  returnOnInvestmentSolar = (pricipal) => {
    let fv1 = pricipal + this.state.totalCost * this.state.years;
    let fv = parseFloat(parseFloat(fv1).toFixed(2));
    this.setState({ solarR: fv });
  };

  returnOnInvestmentStock1 = (pricipal, rate, years) => {
    let fv = pricipal * Math.pow(1 + rate, years);
    return fv;
  };

  returnOnInvestmentSolarReinvestment = (pricipal) => {
    for (let i = this.state.years; i > 0; i--) {
      pricipal += this.returnOnInvestmentStock1(this.state.totalCost, this.state.stock, i);
    };
    let fv = parseFloat(parseFloat(pricipal).toFixed(2));
    this.setState({ solarReinvestment: fv });
  };

  loan = (loan, rate, periods) => {
    let RPP = rate / 12;
    let bottom1 = Math.pow(1 + RPP, -periods);
    let bottom = 1 - bottom1;
    let firstPart = RPP / bottom;
    let payment1 = firstPart * loan;
    let payment = parseFloat(payment1.toFixed(2))
    this.setState({ payment: payment })
  }

  formCheck = (x) => {
    if (!isNaN(x) && x > 0 && x < 600000) {
      return true
    }
    return false
  }

  formCheckYears = (x) => {
    if (!isNaN(x) && x > 0 && x < 50) {
      return true
    }
    return false
  }

  validateForm = () => {
    if (this.state.totalCostValid === true && this.state.totalElectricValid === true)
      this.setState({ formValid: true });
  }

  validateField = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let totalElectricValid = this.state.totalElectricValid;
    let totalCostValid = this.state.totalCostValid;

    switch (fieldName) {
      case 'totalElectric':
        totalElectricValid = this.formCheck(value);
        fieldValidationErrors.totalElectric = totalElectricValid ? '' : ToastsStore.error("numbers only / make sure you're entering the proper amount", 5000) + this.setState({ TotalElectricValid: false }) + this.setState({ formValid: false });
        break;
      case 'totalCost':
        totalCostValid = this.formCheck(value);
        fieldValidationErrors.totalCost = totalCostValid ? '' : ToastsStore.error("numbers only") + this.setState({ TotalCostValid: false }) + this.setState({ formValid: false });
        break;
      case 'years':
        totalCostValid = this.formCheckYears(value);
        fieldValidationErrors.totalCost = totalCostValid ? '' : ToastsStore.error("reasonable amount of years") + this.setState({ TotalCostValid: false }) + this.setState({ formValid: false });
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      totalElectricValid: totalElectricValid,
      totalCostValid: totalCostValid,
    }, this.validateForm());
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value)
    });

  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.state.totalElectric > 0 && this.state.totalCost > 0) {
      this.changeData();
    }
  };
  fixingTheError = () =>{
    this.changeData();
    this.refs.hello.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }, false);
  }
  averageAmericanUsage = () => {
    this.setState({
      totalElectric: 13000,
      totalCost: 1560,
      years: 15,
    })
setTimeout(this.fixingTheError, 101)
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.findInitialInvesment(this.state.totalElectric);
      this.returnOnInvestmentBond(this.state.initialIvestment);
      this.returnOnInvestmentCd(this.state.initialIvestment);
      this.returnOnInvestmentStock(this.state.initialIvestment);
      this.returnOnInvestmentSolar(this.state.initialIvestment);
      this.returnOnInvestmentSolarReinvestment(this.state.initialIvestment);
      this.loan(this.state.initialIvestment, .06, 120)
    }, 100);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8 text-center">

            <Jumbotron>
              <h1 id="outline" >Should I invest in Solar?</h1>
            </Jumbotron>
            <div>
              <h2>Invest?</h2>
            </div>
            <div className="text-left">
              <p>Solar is an investment as long as electricity cost money to buy/use.   With the current trends of the electrical companies charging more and more for electricity,  and solar becoming cheaper and cheaper, solar makes more and more sense to purchase as a homeowner, especially if you live somewhere where running your air conditioner is a must! </p>
              <p> Looking at solar as an investment will help you compare to other types of investments.  You can use this calculator here to help you determine where to put your money to gain more cash flow for your investment. </p>
              <p>Depending on your cost of electricity,  solar has varying returns on investment and its performance as an investment depends on your investment strategy as you will see below.</p>
              <p>The calculator shows returns on a big enough invesmtment in solar to make your electric bill $0</p>
              <div className="text-center">
                <h2>Investing</h2>
              </div>
              <p>First you need to know how much electricity you use. Second you need to know how much you spend on electricity throughout the year. Third you need to enter the amount of years of output</p>
              <p>If you don't have it just <span id="bold" onClick={this.averageAmericanUsage}>click here</span> and the calculator takes the average american electric bill (13,000 KiloWatts per year at a total cost of $1,560) with a output period of 15 years.</p>
              <p>If you’re really big into being carbon neutral and have the money to do so, then you can skip the calculations and go buy some solar.</p>
            </div>
            <div className="text-center second" id="button">

              <Form>
                <FormGroup>
                  <Label for="totalElectric">Total Electrical Use</Label>

                  <Input
                    ref="input1"
                    name="totalElectric"
                    placeholder="In KiloWatts ... Yearly (required)"
                    onChange={this.handleInputChange} />

                  <Label for="totalElectric">Total Electrical Cost</Label>

                  <Input
                    ref="input2"
                    name="totalCost"
                    placeholder="In Dollars ... Yearly (required)"
                    onChange={this.handleInputChange} />

                  <Label for="totalElectric">Years of Output</Label>

                  <Input
                    ref="input3"
                    name="years"
                    placeholder="How Many Years of output would you like to see? (required)"
                    onChange={this.handleInputChange} />

                </FormGroup>

                <Button
                  color="success"
                  id="button"
                  onClick={this.handleFormSubmit}
                  disabled={!this.state.formValid}
                >Submit</Button>

              </Form>

            </div>
          </div>
          <div className="col-lg-2" />
        </div>
        <div className="row">
          <div className="col-lg-2" />
          <div ref="hello" className="col-lg-8 text-center" id="barGraph">
            <ResponsiveContainer>
              <BarChart width={1000} height={500} data={this.state.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={this.CustomToolTip} />
                <Legend />
                <Bar dataKey="Initial Investment" fill="#8884d8" />
                <Bar dataKey="Return" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="col-lg-2" />
        </div>
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8 text-center">
            <h1>Assumptions</h1>
            <div className="text-left">
              <ul>
                <li>The return on investments made net the average according to <a target="_blank" href="https://www.thebalance.com/stocks-vs-bonds-the-long-term-performance-data-416861" rel="noopener noreferrer">The Balance</a></li>
                <li>Dividends are reinvested</li>
                <li>The return on reinvestment of the solar gains are calculated with investment into the stock market</li>
                <li>The returns include the original investment (when you purchase solar, the value of the system you purchased is added to your home)</li>
                <li>Solar Panels get a total of 4 hours of direct sunlight per day </li>
                <li>Solar Panels maintain production (the average panel loses production at a rate of 1% a year)</li>
                <li>The cost of solar is $2.80 per watt (solar cost can vary from $2.80 to $3.70 per watt but it’s highly dependent on your roof) according to <a target="_blank" rel="noopener noreferrer" href="https://www.greentechmedia.com/articles/read/tracking-residential-pv-prices-across-reports">Green Tech Media</a></li>
                <li>The government tax credit is not reduced from the cost</li>
                <li>This website is not a licensed financial advisor</li>
              </ul>
            </div>

            <h2>What does this mean?</h2>
            <div className="text-left">
              <p> Solar is a competitive investment with stock and bonds, if not better, depending on the price you pay for electricity, and definitely better than letting money sit in a savings account.</p>
              <p>Most financial advisors would tell you to diversify your investments. Considering electrical companies don't have a history of reducing their prices, it’s safe to say in the long run solar will save you more money.</p>
              <p>Even though really smart people keep inventing things that require less and less electricity, we find a way to use more and more. For example, electric cars becoming more prominent, electricity use will skyrocket for those considering the purchase.</p>
              <p>People considering solar can get a loan; looking for a loan to dump into stocks won't pan out.</p>

            </div>
            <div>
              <h2>What to Know About Solar</h2>
              <div className='text-left'>
                <ul>
                  <li>Just because you have solar doesn't mean you have free electricity.  Know your production and consumption. Ask installers about Solar Edge and Enphase Systems to track your production.</li>
                  <li>Unless you have a battery or are planning on buying one, you need the grid to run your Solar. Meaning during an electrical blackout, your solar is useless (there are ways around it, but it requires comfortability/experience around electricity).</li>
                  <li>Most power companies wont send you a monthly bill but rather a yearly one. This is done because if you overproduce in one month, it “rolls over” to the next, making your yearly production “fair”.</li>
                  <li>Don’t get sold on overproducing unless your municipality has a long term plan for paying a fair price for your overproduction. Most cities don’t.</li>
                  <li>Roof Space or land is essential for panels. How much solar you can put on your roof highly depends on your local building codes, and you may not be able to buy enough (legally) to get rid of your bill. If you have a lot of land, this shouldn't be an issue.</li>
                  <li>Technology in general is moving rapidly.  In the Solar industry, this means reduction in prices and a change in style of panels. Do your due diligence and make sure the product you buy is what you want.</li>
                  <li>The Government tax credit isn't permanent.</li>
                  <li>Don't lease Solar, own Solar. Owning Solar adds the equity invested into the value of your home while leasing solar may reduce your equity.</li>
                </ul>
              </div>
              <div>
                <h2>Can I afford Solar?</h2>
                <div className="text-left">
                  <p>A lot of people do not have the  <CurrencyFormat value={this.state.initialIvestment} displayType={'text'} thousandSeparator={true} prefix={'$'} />  in hand to outright pay for solar. If you can qualify for a Home Equity Loan, that would be one way to pay for it. Using the income you spend on electricity to pay off the loan is a good start to prove you can pay off the loan.</p>
                  <p>If you do not qualify for a home equity loan; other companies may offer a loan specifically to pay for Solar.</p>
                  <p>A monthly payment on a 10 year loan for <CurrencyFormat value={this.state.initialIvestment} displayType={'text'} thousandSeparator={true} prefix={'$'} /> at 6% interest rate would be around <CurrencyFormat value={this.state.payment} displayType={'text'} thousandSeparator={true} prefix={'$'} /> a month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-2" />
        <div>

          <ToastsContainer store={ToastsStore} />

        </div>
      </div>



    );
  };
};


export default Solar;
