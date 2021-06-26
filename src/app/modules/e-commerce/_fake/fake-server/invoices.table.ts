export class InvoicesTable {
  public static invoices: any = [
    {
      id: 1,
      orderCode: 'ORD0091',
      customerCode: 'Cus',
      customerName: 'Amit',
      contactPerson: '888888888',
      mobile: '7845123265',
      status: 1,
      docNo: 'DocNo',
      date: new Date(),
      
      payTerms: 'Payterms',
      currency: 'currency',
      approval: 'Droft', //Droft/Approved

      collectCash: 'Yes', //Yes/No
      amount: 25000,
      location: 'New Delhi, 110001, Luxmi Nagar'
    },
    {
      id: 1,
      orderCode: 'ORD00923',
      customerCode: 'Cusqw',
      customerName: 'Amitqq',
      contactPerson: '888888888',
      mobile: '7845123265',
      status: 1,
      docNo: 'DocNo',
      date: new Date(),
      payTerms: 'Payterms',
      currency: 'currency',
      approval: 'Approved', //Droft/Approved
      collectCash: 'Yes', //Yes/No
      amount: 25000,
      location: 'New Delhi, 110001, Luxmi Nagar'
    }
  ]
}
