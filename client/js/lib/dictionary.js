//printable column headers
var dictionary = {
    entries_table: {
      entry_id: {text:  'Entry', type: 'text'},
      entry_date: {text:  'Date', type: 'date'},
      account: {text:  'Account', type: 'text'},
      account_name: {text:  'Account Name', type: 'text', style:"width:5%"},
      description: {text:  'Description', type: 'text'},
      amount: {text:  'Amount', type: 'currency'},
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
