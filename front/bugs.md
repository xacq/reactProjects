
Bug1 [Bug Hunt] - Bills
on ne peut pas afficher les justificatifs
explication: seul les justificatif au bon format peuvent s afficher il faut donc forcer l utilisateur a utiliser le bon format

Bug 2 [Bug report] - Bills
classer les bills par ordre d anciennete
on met un sort dans billsUI.js constante rows l 25

Bug 3 [Test E2E] - Parcours Employé


Bug 4 # [Bug Hunt] - Dashboard
On ne peut pas selectionner correctement les factures
Bug dans dashboard.js
explication: un nouvel eventListener etait ajoute a chaque clic sur l icone. on doit donc les desactiver avant d activer en fin de fonction  un seul event listener par bill qui donc le selectionne.



     else {
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




Bug5 # [Bug report] - Login
Je ne peu pas me connecter comme administrateur

explication: erreur de id dans le query selector
dans la methode handleSubmitAdmin(Login.js)
input[data-test=emplyee au lieu de data-test=admin] dans email et password
methode handleSubmitAdmin


Bug 6 # [Ajout de tests unitaires et d'intégration]


Respecter la structure des tests unitaires en place : Given  / When / Then avec le résultat attendu. Un exemple est donné dans le squelette du test __tests__/Bills.js




l3 28 Bills.js completer comme la ligne 37
case 1 ajout testunitaire et d integration

mettre a 80%
sur kamban (
http://127.0.0.1:8080/coverage/lcov-report/containers/Bills.js.html
http://127.0.0.1:8080/coverage/lcov-report/containers/NewBill.js.html)

Reference Bills.js




[Test E2E] - Parcours Employé