import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"


//Ceux ci est la page ou on arrive après la connexion


//Cette fonction filtre les factures en fonction d'un statut donné. 
//Si les données sont présentes, elle retourne un tableau filtré, 
//sinon elle retourne un tableau vide.
export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
      else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition
    }) : []
}


//Cette fonction génère une carte HTML représentant une facture donnée.
//Elle extrait le prénom, le nom, le nom de la facture, le montant, la date et le type de la facture 
//pour les afficher de manière structurée.
export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
  firstAndLastNames.split('.')[1] : firstAndLastNames

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}
//Cette fonction génère une chaîne de cartes HTML 
//en utilisant la fonction card pour chaque facture dans le tableau fourni.
// Elle renvoie une chaîne vide si le tableau de factures est vide.
export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}
//Cette fonction mappe un index à un statut de facture. Elle est  utilisée pour convertir un index 
//en un statut spécifique (en attente, accepté, refusé).
export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}
//Cette classe semble être la pièce maîtresse du tableau de bord. 
//Le constructeur initialise les propriétés nécessaires et attache 
//des gestionnaires d'événements. Elle comporte également plusieurs méthodes
// qui traitent les interactions utilisateur et effectuent des opérations sur les factures.
export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    new Logout({ localStorage, onNavigate })
  }

  handleClickIconEye = () => {

    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }

  handleEditTicket(e, bill, bills) {
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id
    if (this.counter % 2 === 0) {
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' })
      })
      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({ height: '150vh' })
      this.counter ++
    } else {
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' })

      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `)
      $('.vertical-navbar').css({ height: '120vh' })
      this.counter ++
    }
    $('#icon-eye-d').click( this.handleClickIconEye)
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.index === undefined || this.index !== index) this.index = index
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)'})
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      this.counter ++
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)'})
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter ++
    }
    // Détacher les gestionnaires d'événements existants
    bills.forEach(bill => {
      $(`#open-bill${bill.id}`).off('click');
  });
  
    bills.forEach(bill => {
      $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
    })

    return bills

  }
//Cette fonction récupère toutes les factures de tous les utilisateurs depuis le magasin. 
//Elle utilise la propriété store pour obtenir la liste des factures, les formate,
// et les renvoie sous forme de promesse.
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
        .map(doc => ({
          id: doc.id,
          ...doc,
          date: doc.date,
          status: doc.status
        }))
        return bills
      })
      .catch(error => {
        throw error;
      })
    }
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
    return this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: bill.id})
      .then(bill => bill)
      .catch(console.log)
    }
  }
}
