/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"
import { ActionHeader } from "../components/general/ActionHeader"
import { AvatarInput } from "../components/general/AvatarInput"
import { Footer } from "../components/general/Footer"
import { Header } from "../components/general/Header"
import clearIcon from '../assets/images/clear.svg';
import logoutIcon from '../assets/images/logout.svg';
import { LoginServices } from "../services/LoginServices"
import { useNavigate } from "react-router-dom"
import { AuthorizeContext } from "../App"
import { UserServices } from "../services/UserServices"

const loginServices = new LoginServices();
const userServices = new UserServices();

export const Profile = () => {

    const navigate = useNavigate();
    const {setToken} = useContext(AuthorizeContext);
    const [name, setName] = useState(localStorage.getItem('name') || '');
    const [image, setImage] = useState(localStorage.getItem('avatar') || '');

    const mobile = window.innerWidth <= 992;

    const finishUpdate = async() => {
        try{
            if(!name || name.trim().length < 2){
                return;
            }
    
            const body = { name } as any;
    
            if(image){
                body.avatar = image;
            }
    
            await userServices.update(body);

            localStorage.setItem('name', name);

            if(image){
                localStorage.setItem('avatar', image);
            }

            return navigate(-1);
        }catch(e:any){
            if(e?.response?.data?.message){
                console.log('Ocorreu erro ao atualizar dados do usuário:', e?.response?.data?.message);
            }else{
                console.log('Ocorreu erro ao atualizar dados do usuário:', e);
            }
        }
    }

    const logout = () => {
        loginServices.logout(setToken);
        navigate('/')
    }

    return (
        <>
            {!mobile && <Header />}
            <div className="container-profile">
                <ActionHeader actionCallback={finishUpdate} disabled={!name}/>
                <AvatarInput image={image} setImage={setImage} />
                <div className="input">
                    <div>
                        <span>Nome</span>
                        <input type="text" placeholder="Informe seu nome" 
                            value={name} onChange={e => setName(e.target.value)} />
                        {name && <img src={clearIcon} alt="limpar" onClick={() => setName('')} />}
                    </div>
                </div>
                <div className="logout">
                    <div onClick={logout}>
                        <img src={logoutIcon} alt="Sair" />
                        <span>Sair</span>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}