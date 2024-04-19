import React, { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";
import { useAppContext } from "../contexts/AppContext";
import toast from "react-hot-toast";
const Web3Utils = require('web3-utils');

const Home = () => {
  const { web3, account, connectToMetaMask, connected, connecting } =
    useAppContext();
  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState("idle");
  const [id, setId] = useState("");
  const [balance, setBalance] = useState("");
  const [newCharity, changeCharity] = useState("");
  const [charity, setCharity] = useState("");

  const getCurrentCharity = async (e) => {
    try {
      setIsLoading("fetching");
      const charity = await web3.methods.getCharity().call();
      setIsLoading("idle");
      setCharity(charity);
    } catch (error) {
      setIsLoading("idle");
      toast.error("Error in getting current charity: " + error.message);
    }
  }
  const getId = async (e) => {
    try {
      setIsLoading("fetching");
      const id = await web3.methods.getId().call();
      setIsLoading("idle");
      setId(id);
    } catch (error) {
      setIsLoading("idle");
      toast.error("Error in fetching fleet");
    }
  };


    const handleNewCharity = async (e) => {
        e.preventDefault();
        if (inputRef.current.value === "") {
            return;
        }

        try {
            setIsLoading("changing");
            if (!account) {
                toast.error("Please connect to your wallet");
                setIsLoading("idle");
                return;
            }

            await web3.methods
                .changeCharity(inputRef.current.value)
                .send({
                    from: account,
                    gas: 3000000,
                })
                .on("receipt", () => {
                    inputRef.current.value = "";
                    getCurrentCharity();
                    toast.success("Charity changed successfully");
                    setIsLoading("idle");
                })
                .on("error", () => {
                    throw new Error("Error in changing charity");
                });
        } catch (error) {
            console.log(error);
            toast.error("Error in changing charity: " + error.message);
            setIsLoading("idle");
        }
    };

  const handlePayTicket = async (e) => {
    e.preventDefault();

    try {
      setIsLoading("paying");
      if (!account) {
        toast.error("Please connect to your wallet");
        setIsLoading("idle");
        return;
      }

      await web3.methods
          .payTicket()
          .send({
            from: account,
            value: Web3Utils.toWei("0.01", "ether")
          })
          .on("receipt", () => {
            getId();
            getBalance();
            toast.success("Ticket paid successfully");
            setIsLoading("idle");
          })
          .on("error", () => {
            throw new Error("Error in paying ticket");
          });
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error in paying ticket");
      setIsLoading("idle");
    }
  };

  const getBalance = async (e) => {
    try {
      setIsLoading("fetching");
      const balance = await web3.methods.getBalance().call();
      setIsLoading("idle");
      setBalance(Web3Utils.fromWei(balance, "ether"));
    } catch (error) {
      setIsLoading("idle");
      toast.error("Error in fetching fleet");
    }
  };

  useEffect(() => {
    if (connected) {
      getId();
      getBalance();
      getCurrentCharity();
    }
  }, [connected]);

  return (
      <section className={styles.home}>
          <div className={styles.title}>
              Jackpot
          </div>
          <div className={styles.number}>
              This app is a jackpot for students who need financial help.
              You can buy a ticket which gives you the chance to take home 80%
              of the jackpot.
              The remaining 20% goes to a charity !<br/>
              When three tickets have been bought, the money is sent to the
              winner and the charity. And a new jackpot is created. <br/>

          </div>
          <div className={styles.wallet}>
              {!connected && (
                  <button onClick={connectToMetaMask}>
                      {connecting ? "Connecting..." : "Connect to MetaMask"}
                  </button>
              )}
          </div>
          <div className={styles.number}>
              {isLoading === "fetching" ? (
                  <p>Fetching ID...</p>
              ) : (
                  <p>
                      ID of the charity: <span>{id.toString()}</span>
                  </p>
              )}
          </div>
          <div className={styles.number}>
              {isLoading === "fetching" ? (
                  <p>Fetching balance...</p>
              ) : (
                  <p>
                      Balance: <span>{balance.toString()}</span>
                  </p>
              )}
              <br/>
          </div>
          <div className={styles.form}>
              <form onSubmit={handlePayTicket}>
                  <button type="submit" disabled={!connected || isLoading === "paying"}>
                      {isLoading === "paying" ? "Paying..." : "Pay for a ticket"}
                  </button>
              </form>
          </div>
          <div className={styles.number}>
              The current charity is: <span>{charity.toString()}</span>
          </div>
          <div className={styles.form}>
              <form onSubmit={handleNewCharity}>
                  <input
                      type="newCharity"
                      ref={inputRef}
                      placeholder="Enter new charity, only the actual charity can change it"
                      required
                  />
                  <button type="submit" disabled={!connected || isLoading === "changing"}>
                      {isLoading === "changing" ? "Changing..." : "Change charity"}
                  </button>
              </form>
          </div>
      </section>
  );
};

export default Home;
