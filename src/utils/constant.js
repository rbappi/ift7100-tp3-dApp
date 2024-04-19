export const address = "0x9118E4c6cF673b375dF95450ae1D760Aa984D98a";

export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getId",
    outputs: [
      {
        internalType: "uint",
        name: "",
        type: "int", // TO CHECK
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint",
        name: "",
        type: "int",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payTicket",
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
        {
            internalType: "address",
            name: "newCharity",
            type: "address", // TO CHECK
        },
    ],
    outputs: [],
    name: "changeCharity",
    stateMutability: "nonpayable",
    type: "function",
  },

  {
    inputs: [],
    name: "getCharity",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  }
];
