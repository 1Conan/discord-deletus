const fetch = require('node-fetch');
const baseApiUrl = 'https://discordapp.com/api/v6';

module.exports = (headers) => {
  const loadMessages = (gid, uid) => fetch(`${baseApiUrl}/guilds/${gid}/messages/search?author_id=${uid}`, { 
    headers 
  }).then(r => r.json()).catch(console.error);
  
  const loadDM = () => fetch(`${baseApiUrl}/users/@me/channels`, { headers }).then(r => r.json());
  
  const deleteDM = (cId, mId) => fetch(`${baseApiUrl}/channels/@me/${cId}/${mId}`, {
    headers,
    method: 'DELETE'
  }).then(r => r.json());

  const deleteMessage = (channelId, msgId) => fetch(`${baseApiUrl}/channels/${channelId}/messages/${msgId}`, { 
    headers, 
    method: 'DELETE',
  });

  const getGuildInfo = (gId) => fetch(`${baseApiUrl}/guilds/${gId}`, { headers }).then(r => r.json());
  return {
    loadMessages,
    deleteMessage,
    getGuildInfo,
    loadDM,
    deleteDM,
  }
}


