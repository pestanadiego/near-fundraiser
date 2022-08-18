import React, { useEffect, useState, useCallback } from "react";
import AddFundraise from "./AddFundraise";
import Fundraise from "./Fundraise";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import toast from "react-hot-toast";
import {
  getFundraises as getFundraiseList,
  makeDonation,
  doUpvote,
  createFundraise,
} from "../../utils/forum";
import { quickSort } from "../../utils/sorting";

const Fundraises = ({ account }) => {
  const [fundraises, setFundraises] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFundraises = useCallback(async () => {
    try {
      setLoading(true);
      const unorderedFundraises = await getFundraiseList();
      const fundraisesWithCount = [];
      for (let i = 0; i < unorderedFundraises.length; i++) {
        fundraisesWithCount.push([
          countUpvotes(unorderedFundraises[i]),
          unorderedFundraises[i],
        ]);
      }
      const orderedFundraises = quickSort(fundraisesWithCount);

      const fundraiseList = [];
      for (let i = 0; i < orderedFundraises.length; i++) {
        fundraiseList.push(orderedFundraises[i][1]);
      }
      setFundraises(fundraiseList);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addFundraise = async (data) => {
    try {
      setLoading(true);
      createFundraise(data).then((resp) => {
        console.log(resp);
        getFundraises();
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const donate = async (id, account, amount) => {
    try {
      await makeDonation({
        id,
        account,
        amount,
      }).then(() => getFundraises());
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const upvote = async (id, account, isDonation) => {
    try {
      await doUpvote({ id, account, isDonation }).then((resp) =>
        getFundraises()
      );
    } catch (error) {
      toast.error(error.kind["ExecutionError"].substr(25, 15));
    } finally {
      setLoading(false);
    }
  };

  const countUpvotes = (fundraise) => {
    let count = 0;
    if (fundraise.upvotes) {
      for (let i = 0; i < fundraise.upvotes.length; i++) {
        count++;
      }
    }
    return count;
  };

  useEffect(() => {
    getFundraises();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className='d-flex justify-content-center align-items-center mb-5'>
            <h1 className='fs-1 mb-0 fw-bold'>Fundnear 💸</h1>
          </div>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h1 className='fs-5 mb-0'>
              Donate to good causes and help others!
            </h1>
            <AddFundraise save={addFundraise} account={account} />
          </div>
          <Row xs={1} sm={2} lg={3} className='g-3  mb-5 g-xl-4 g-xxl-5'>
            {fundraises
              .slice(0)
              .reverse()
              .map((_fundraise) => (
                <Fundraise
                  key={_fundraise.id}
                  fundraise={{
                    ..._fundraise,
                  }}
                  donate={donate}
                  upvote={upvote}
                  account={account}
                />
              ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Fundraises;
