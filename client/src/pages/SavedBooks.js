import React, {useEffect, useState} from 'react';
import {Button, Card, CardColumns, Container, Jumbotron} from 'react-bootstrap';
import Auth from '../utils/auth';
import {DELETE_BOOK, GET_SINGLE_USER, removeBookId} from '../utils';
import {useMutation, useQuery} from "@apollo/client";
import {useHistory} from "react-router-dom";



const SavedBooks = () => {

  const shouldRedirectUser = !Auth.loggedIn() || Auth.isTokenExpired()

  const history=useHistory()

  if(shouldRedirectUser){
    history.push('/')
  }

  const [userData, setUserData] = useState({});
  const {data} = useQuery(GET_SINGLE_USER,{
    fetchPolicy:'cache-and-network'
  })
  const [deleteBook]=useMutation(DELETE_BOOK,{
    refetchQueries:[GET_SINGLE_USER]
  })

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    try{
      if(data?.getSingleUser){
          setUserData(data?.getSingleUser)
      }
    }catch (e) {
      console.log(e)
    }
  },[data]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data} = await deleteBook({variables: {bookId}});
      console.log(data)
      setUserData(data.deleteBook);
      removeBookId(bookId)
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
