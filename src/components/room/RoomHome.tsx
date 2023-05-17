/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import emptyIcon from '../../assets/images/empty_list.svg';
import copyIcon from '../../assets/images/copy.svg';
import { RoomServices } from "../../services/RoomServices";
import { RoomObjects } from "./RoomObjects";

const roomServices = new RoomServices();

export const RoomHome = () => {
    const navigate = useNavigate();
    const [objects, setObjects] = useState([]);
    const [color, setColor] = useState('');
    const [name, setName] = useState('');
    const [me, setMe] = useState<any>({});
    const [showModal, setShowModal] = useState(false);

    const [connectedUsers, setConnectedUsers] = useState([]);

    const { link } = useParams();
    const userId = localStorage.getItem('id') || '';

    const getRoom = async () => {
        try {
            if (!link) {
                return navigate('/');
            }

            const result = await roomServices.getRoomByLink(link);

            if (!result || !result.data) {
                return;
            }

            const { color, name, objects } = result.data;

            setName(name);
            setColor(color);

            const newObjects = objects.map((o: any) => {
                return { ...o, type: o?.name?.split('_')[0] }
            });

            setObjects(newObjects);

            // userMediaStream = await navigator?.mediaDevices?.getUserMedia({
            //     video: {
            //         width: { min: 640, ideal: 1280 },
            //         height: { min: 400, ideal: 1080 },
            //         aspectRatio: { ideal: 1.7777 },
            //     },
            //     audio: true
            // });

            // if (document.getElementById('localVideoRef')) {
            //     const videoRef: any = document.getElementById('localVideoRef');
            //     videoRef.srcObject = userMediaStream;
            // }
        } catch (e) {
            console.log('Ocorreu erro ao buscar dados da sala:', e);
        }
    }


    useEffect(() => {
        getRoom();
    }, [])

    const toggleMute = () => {
        const payload = {
            userId,
            link,
            muted: !me.muted
        }

        // wsServices.updateUserMute(payload);
    }

    const enterRoom = () => {
        // if(!userMediaStream){
        //     return setShowModal(true);
        // }

        if (!link || !userId) {
            return navigate('/');
        }

        // wsServices.joinRoom(link, userId);
        // wsServices.onCallMade();
        // wsServices.onUpdateUserList(async (users: any) => {
            // if (users) {
            //     setConnectedUsers(users);
            //     localStorage.setItem('connectedUsers', JSON.stringify(users));

            //     const me = users.find((u: any) => u.user === userId);
            //     if (me) {
            //         setMe(me);
            //         localStorage.setItem('me', JSON.stringify(me));
            //     }

                // const usersWithoutMe = users.filter((u : any) => u.user !== userId);
        //         for(const user of usersWithoutMe){
        //             wsServices.addPeerConnection(user.clientId, userMediaStream, (_stream : any) => {
        //                 if (document.getElementById(user.clientId)) {
        //                     const videoRef: any = document.getElementById(user.clientId);
        //                     videoRef.srcObject = _stream;
        //                 }
        //             });
        //         }
        //     }
        // });


        // wsServices.onRemoveUser((socketId: any) => {
        //     const connectedStr = localStorage.getItem('connectedUsers') || '';
        //     const connectedUsers = JSON.parse(connectedStr);
        //     const filtered = connectedUsers?.filter((u: any) => u.clientId !== socketId);
        //     setConnectedUsers(filtered);
        //     wsServices.removePeerConnection(socketId);
        // });

        // wsServices.onAddUser((user: any) => {
        //     console.log('onAddUser', user);

        //     wsServices.addPeerConnection(user, userMediaStream, (_stream : any) => {
        //         if (document.getElementById(user)) {
        //             const videoRef: any = document.getElementById(user);
        //             videoRef.srcObject = _stream;
        //         }
        //     });

        //     wsServices.callUser(user);
        // });

        // wsServices.onAnswerMade((socket:any) => wsServices.callUser(socket));
    }

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    }


    const getUsersWithoutMe = () => {
        return connectedUsers.filter((u: any) => u.user !== userId);
    }

    return (
        <div className="container-principal">
            <div className="container-room">
                {
                    objects?.length > 0
                        ?
                        <>
                            <div className="resume">
                                <div onClick={copyLink}>
                                    <span><strong>Reunião</strong> {link}</span>
                                    <img src={copyIcon} />
                                </div>
                                <p style={{ color }}>{name}</p>
                                <audio id='localVideoRef' playsInline autoPlay muted />
                                {getUsersWithoutMe()?.map((user: any) =>
                                    <audio key={user.clientId} id={user.clientId}
                                        playsInline autoPlay muted={user?.muted} />
                                )}
                            </div>
                            <RoomObjects
                                objects={objects}
                                enterRoom={enterRoom}
                                connectedUsers={connectedUsers}
                                me={me}
                            toggleMute={toggleMute}
                            />
                        </>



                        :
                        <div className="empty">
                            <img src={emptyIcon} />
                            <p>Reunião não encontrada :/</p>
                        </div>

                }
            </div>

        </div>
    )

}