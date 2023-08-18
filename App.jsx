import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'
import './app.css';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({})

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(listaPost);
    })
}

loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          // se tem usuario logado ele entra aqui...
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })

        }else{
          // nao possui nenhum user logado.
          setUser(false);
          setUserDetail({})
        }
      })
    }

    checkLogin();

  }, [])

async function handleAdd() {
  //await setDoc(doc(db, "posts", "12345"), {
  //titulo: titulo,
  //autor: autor,
  //})
  //.then (() => {
  //console.log("Dados Registrado no Banco!")
  //})
  //.catch ((error) => {
  //console.log("Gerou Erro" + error)
  //})

  await addDoc(collection(db, "posts"), {
    titulo: titulo,
    autor: autor,
  })
    .then(() => {
      console.log("Cadastrado com sucesso!")
      setAutor('')
      setTitulo('')
    })
    .catch((error) => {
      console.log(" Erro" + error)
    })

}

async function buscarPost() {

  //const postRef = doc(db, "posts", "123")
  //await getDoc(postRef)
  //.then((snopshot) => {
  //setAutor(snopshot.data().autor)
  //setTitulo(snopshot.data().titulo)
  //})
  //.catch (() => {
  //console.log("Erro ao buscar")
  //})

  const postRef = collection(db, "posts")

  await getDocs(postRef)
    .then((snopshot) => {
      let lista = [];

      snopshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(lista);
    })
    .catch(() => {
      console.log("Erro ao buscar")
    })
}

async function editarPost() {
  const docRef = doc(db, "posts", idPost)

  await updateDoc(docRef, {
    titulo: titulo,
    autor: autor
  })
    .then(() => {
      console.log("POST ATUALIZADO!")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch((error) => {
      console.log(error)
    })
}

async function excluirPost(id) {
  const docRef = doc(db, "posts", id)
  await deleteDoc(docRef)
    .then(() => {
      alert("Post deletado com sucesso!")
    })
}

async function novoUsuario(){
  await createUserWithEmailAndPassword(auth, email, senha)
  .then(() => {
    console.log("CADASTRADO COM SUCESSO!")
  
    setEmail('')
    setSenha('')
  })
  .catch((error) => {
    
    if(error.code === 'auth/weak-password'){
      alert("Senha muito fraca.")
    }else if(error.code === 'auth/email-already-in-use'){
      alert("Email já existe!")
    }

  })
}

async function logarUsuario(){
  await signInWithEmailAndPassword(auth, email, senha)
  .then((value) => {
    console.log("USER LOGADO COM SUCESSO")
    console.log(value.user);

    setUserDetail({
      uid: value.user.uid,
      email: value.user.email,
    })
    setUser(true);

    setEmail('')
    setSenha('')
  })
  .catch(() => {
    console.log("ERRO AO FAZER O LOGIN")
  })
}

async function fazerLogout(){
  await signOut(auth)
  setUser(false);
  setUserDetail({})
}


return (
  <div>
    <h1> Bem-vindo apredendo ReactJs com Firebase :) </h1>

    { user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado!)</strong> <br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span> <br/>
          <button onClick={fazerLogout}>Sair da conta</button>
          <br/> <br/>
        </div>
      )}

    <div className="container">
      <h2>Usuarios</h2>

      <label>Email</label>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Digite um email"
      /> <br/>

      <label>Senha</label>
      <input 
        value={senha}
        onChange={(e) => setSenha(e.target.value)} 
        placeholder="Informe sua senha"
      /> <br/> 

      <button onClick={novoUsuario}>Cadastrar</button>   
      <button onClick={logarUsuario}>Fazer login</button> 
    </div>

    <br/><br/>
    <hr/>

    <div className='container'>

      <label> Id do Post: </label>
      <input
        placeholder='Digite o ID do post'
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
      /> <br />

      <label> Titulo: </label>
      <textarea
        type="text"
        placeholder='Digite o titulo'
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <label> Autor</label>
      <input type="text"
        placeholder='Autor do post'
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />

      <button onClick={handleAdd} > Cadastrar</button> 
      <button onClick={buscarPost}> Buscar posts</button> 
      <button onClick={editarPost}> Atualizar posts</button>

      <ul>
        {posts.map((posts) => {
          return (
            <li key={posts.id}>
              <strong>ID: {posts.id} </strong> <br />
              <span> Título: {posts.titulo} </span> <br />
              <span> Autor: {posts.autor} </span> <br /> <br />
              <button onClick={() => excluirPost(posts.id)}> Excluir </button> <br /> <br />
            </li>
          )
        })}
      </ul>

    </div>

  </div >
);
}

export default App;
