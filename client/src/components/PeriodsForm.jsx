import React from 'react';
import Joi from 'joi-browser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import ExpensesStats from './ExpensesStats';
import ExpensesDetails from './ExpensesDetails';
import Form from './common/Form';
import SimpleModal from './common/SimpleModal';
import { getPeriod, savePeriod, initPeriod } from '../services/periodsService';
import { getExpensesByPeriod } from '../services/expensesService';
import { getPDetailsByPeriod } from '../services/pdetailsService';
import auth from '../services/authService';

class PeriodsForm extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        period: '',
        userId: '',
        totalA: 0,
        totalB: 0,
        totalIncome: 0,
        isClosed: false
      },
      sortColumn: { path: 'model', order: 'asc' },
      errors: {}
    };
    this.togglePeriod = this.togglePeriod.bind(this);
  }

  toPDF = async id => {
    const input = document.getElementById(id);
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 5, 5);
    pdf.save(`Expensas_JI1840_${this.state.period}.pdf`);
  };

  async componentDidMount() {
    const { id, period: newPeriod } = this.props.match.params;

    if (newPeriod) {
      await this.newPeriod(newPeriod);
    } else {
      await this.populatePeriod(id);
    }

    const { period } = this.state.data;
    await this.populateDetails(period);

    await this.populateExpenses(period);
  }

  async populateExpenses(period) {
    const expenses = await getExpensesByPeriod(period);
    console.log('expenses period', period);
    this.setState({ expenses });
  }

  async populateDetails(period) {
    const { data: details } = await getPDetailsByPeriod(period);
    this.setState({ details });
  }
  async populatePeriod(id) {
    const { data: period } = await getPeriod(id);
    this.setState({ data: this.mapToViewModel(period) });
    // return this.props.history.replace('/not-found');
  }

  async newPeriod(period) {
    const body = {
      period: period,
      userId: auth.getCurrentUser()._id,
      totalA: 0,
      totalB: 0,
      totalIncome: 0,
      isClosed: false
    };

    const { data: newPeriod } = await initPeriod(body);
    this.setState({ data: this.mapToViewModel(newPeriod) });
  }

  mapToViewModel(p) {
    return {
      _id: p._id,
      period: p.period,
      userId: p.userId,
      totalA: p.totalA,
      totalB: p.totalB,
      totalIncome: p.totalIncome,
      isClosed: p.isClosed
    };
  }

  togglePeriod() {
    this.setState(prevState => ({ modal: !prevState.modal }));
  }

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  schema = {
    _id: Joi.string(),
    period: Joi.string()
      .required()
      .label('Periodo'),
    userId: Joi.string()
      .required()
      .label('Usuario'),
    totalA: Joi.number()
      .required()
      .label('Total Expensas A'),
    totalB: Joi.number()
      .required()
      .label('Total Expensas B'),
    totalIncome: Joi.number()
      .required()
      .label('Total Income'),
    isClosed: Joi.boolean().label('Cerrado')
  };

  doSubmit = () => {
    this.togglePeriod();
  };

  handleSavePeriod = async () => {
    const period = { ...this.state.data };

    // period.isClosed = true;
    await savePeriod(period);

    this.togglePeriod();
    const { history } = this.props;
    history.push('/periods');
  };

  ModalPeriodBody = data => {
    const { _id, period } = data;
    const bodyPeriod = (
      <p className="lead">
        Se cerrará el periodo <mark>{period}</mark>. Los usuarios que no hayan
        registrado pagos en el período se registrarán como deudores.
      </p>
    );

    const bodyNewPeriod = (
      <p className="lead">
        Se iniciará el periodo <mark>{period}</mark>.
      </p>
    );

    return _id ? bodyPeriod : bodyNewPeriod;
  };

  render() {
    const { details, expenses, modal, data } = this.state;
    const { totalA, totalB, totalIncome, _id } = data;
    const saveButtonLabel = !_id ? 'Iniciar Período' : 'Cerrar Período';

    if (!details || !expenses) return 'No hay información disponible';

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <div id="pdf" className="page">
              <SimpleModal
                isOpen={modal}
                toggle={this.togglePeriod}
                title={saveButtonLabel}
                label={saveButtonLabel}
                action={this.handleSavePeriod}
                body={this.ModalPeriodBody(data)}
              />

              <ExpensesStats expenses={expenses} />
              <ExpensesDetails details={details} />
            </div>
          </div>
          <div className="col">
            <i
              className="fa fa-download blue clickable"
              onClick={event => this.toPDF('pdf')}
            >
              descargar
            </i>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PeriodsForm;
