//printable column headers
var dictionary = {

    accounts_table: {
      account: {text:  'Account', type: 'text', style:"width:10%"},
      name: {text:  'Name', type: 'text', style:"width:60%"},
      type: {text:  'Type', type: 'text', style:"width:10%"},
      balance: {text:  'Balance', type: 'currency', style:"width:20%"}
    },

    entries_table: {
      entry_id: {text:  'Entry', type: 'text', style:"width:10%"},
      entry_date: {text:  'Date', type: 'date', style:"width:10%"},
      account: {text:  'Account', type: 'text', style:"width:10%"},
      account_name: {text:  'Account Name', type: 'text', style:"width:20%"},
      description: {text:  'Description', type: 'text'},
      amount: {text:  'Amount', type: 'currency', style:"width:20%"},
    },

    ledger_table: {
      entry_id: {text:  'Entry', type: 'text', style:"width:10%"},
      invoice: {text:  'Entry', type: 'text', style:"width:10%"},
      entry_date: {text:  'Date', type: 'date', style:"width:10%"},
      description: {text:  'Description', type: 'text'},
      debit: {text:  'Debit', type: 'currency', style:"width:20%"},
      credit: {text:  'Credit', type: 'currency', style:"width:20%"},
      // amount: {text:  'Amount', type: 'currency', style:"width:20%"},
    },

    customers_table: {
      Account: {text:  'Account', type: 'text'},
      name: {text:  'Name', type: 'text'},
      tax_id: {text:  'Tax ID', type: 'text'},
      email: {text:  'Email', type: 'text'},
      address: {text:  'Address', type: 'text'},
      Balance: {text:  'Balance', type: 'currency'},
      TurnoverYTD: {text:  'TurnoverYTD', type: 'currency'},
    },

    other: {
      hourly_rate: {text:  'Hourly Rate', type: 'text'},
      billable_time: {text:  'Time Spent', type: 'text'},
      billable_amount: {text:  'Amount Due', type: 'text'},
      bill: {text:  '', type: 'text'},
      start_stop_btn: {text:  '', type: 'text'},
      project_id: {text:  'Project ID', type: 'text'},
      start: {text:  'Start', type: 'text'},
      stop: {text:  'Stop', type: 'text'},
      billed: {text:  'Billed', type: 'text'},
      role: {text:  'Role', type: 'text'}
    }
};
