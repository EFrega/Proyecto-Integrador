-- ACLARACIONES GENERALES:
-- Este script crea las tablas necesarias para un sistema de chat entre usuarios
-- incluye la indexación de chats, el almacenamiento de mensajes y el estado de los mismos
-- se contempla que el intento de enviar un mensaje a otro usuario genera un nuevo idchat antes de generar un registro de nuevo mensaje
-- solamente en caso que no exista previamente un idchat que vincule a los dos usuarios


-- ChatStatus es una tabla de referencia de los estados de los mensajes
-- 0 = pendiente, cuando el usuario receptor aun no se loguea y el mensaje no se carga en su bandeja de entrada
-- 1 = entregado, cuando el usuario receptor se loguea y el mensaje se carga en su bandeja de entrada
-- 2 = leído, cuando el usuario receptor abre la conversacion y se muestra el mensaje
-- podrian existir otros estados como los siguientes pero se eliminan para simplificar el modelo:
-- 3 = eliminado por el emisor, cuando el usuario emisor elimina el mensaje que emitió en la conversación
-- 4 = eliminado por el receptor, cuando el usuario receptor elimina el mensaje que recibió en la conversación

CREATE TABLE ChatStatus (
    msgstatus INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);
-- Insertar los estados
INSERT INTO ChatStatus (description) VALUES 
('pendiente'),
('entregado'), 
('leído');

-- ChatIndex es una lista de todos los chats que existen.
-- Un chat es una conversación que voncula a dos usuarios
-- aqui se garantiza que no haya mas que un solo chat entre dos mismos usuarios 
CREATE TABLE ChatIndex (
    idchat INT AUTO_INCREMENT PRIMARY KEY,
    idsystemuser1 INT NOT NULL,
    idsystemuser2 INT NOT NULL,
    CONSTRAINT uq_unique_chat_between_users 
        UNIQUE (LEAST(idsystemuser1, idsystemuser2), GREATEST(idsystemuser1, idsystemuser2)),
    FOREIGN KEY (idsystemuser1) REFERENCES Contactos(idusuario),
    FOREIGN KEY (idsystemuser2) REFERENCES Contactos(idusuario)
);

-- Chatmsgs lista cada uno de los mensajes de cada chat del sistema
-- Cada mensaje tiene un emisor explicito y un receptor implícito que se obtiene de la tabla ChatIndex.
-- Tambien se podria agregar un campo de idsystemuserreceptor para simplificar las consultas y evitar un join con ChatIndex
-- se incluye una restriccion de unicidad para evitar duplicados de mensajes en un mismo chat

CREATE TABLE Chatmsgs (
    idmsg INT AUTO_INCREMENT PRIMARY KEY,
    idchat INT NOT NULL,
    idsystemuseremisor INT NOT NULL,
    msgtimesent DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    msgtimerecieved DATETIME, 
    msgtimeread DATETIME,
    msgtexto TEXT,
    msgvisibletoemiter INT NOT NULL DEFAULT 1,
    msgvisibletoreciever INT NOT NULL DEFAULT 1,
    msgstatus INT NOT NULL DEFAULT 0,
    msglastupdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_unique_msg_in_chat 
        UNIQUE (idchat, idsystemuseremisor, msgtimesent),
    FOREIGN KEY (idsystemuseremisor) REFERENCES Contactos(idusuario),
    FOREIGN KEY (msgstatus) REFERENCES ChatStatus(msgstatus),
    FOREIGN KEY (idchat) REFERENCES ChatIndex(idchat)
);