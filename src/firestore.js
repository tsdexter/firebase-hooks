import { useState, useEffect } from "react";
import "firebase/auth";
import "firebase/firestore";

export const useFirestore = ({ ref, getOnce }) => {
  const [docState, setDocState] = useState({
    isLoading: true,
    error: null,
    result: null,
    data: null
  });

  useEffect(() => {
    if (getOnce) {
      ref
        .get()
        .then(result => {
          console.log({ result });
          if (result.exists || result.size > 0) {
            setDocState({
              isLoading: false,
              result: result,
              data: result.docs
                ? result.docs.map(i => {
                    return { id: i.ref.id, ref: i.ref, ...i.data() };
                  })
                : result.data(),
              error: null
            });
          } else {
            setDocState({
              isLoading: false,
              result: null,
              data: null,
              error: new Error("No such document!")
            });
          }
        })
        .catch(error => {
          setDocState({
            isLoading: false,
            result: null,
            data: null,
            error
          });
        });
    } else {
      return ref.onSnapshot(result => {
        console.log({ result, ref, type: typeof result });
        setDocState({
          isLoading: false,
          result: result,
          data: result.docs
            ? result.docs.map(i => ({ id: i.ref.id, ref: i.ref, ...i.data() }))
            : result.data(),
          error: null
        });
      });
    }
  }, []);

  return docState;
};
