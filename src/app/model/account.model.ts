export interface AccountHistory {
  accountId:            string;
  balance:              number;
  currentPage:          number;
  totalPages:           number;
  pageSize:             number;
  accountOperationDTOS: AccountOperationDTO[];
}

export interface AccountOperationDTO {
  id:            number;
  date: Date;
  amount:        number;
  type:          string;
  description:   string;
}

export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
}

export interface AccountDTO {
  type: string;
  id: string;
  currency: string;
  balance: number;
  createdAt: Date;
  accountStatus?: any;

}
