/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-10 18:09:49
 * @LastEditTime: 2021-06-07 03:18:01
 */
import Sessions from '../../controllers/sessions.js';
import get from "async-get-file";
import util from 'util';
import urlExistsImport from 'url-exists';
const urlExists = util.promisify(urlExistsImport);

export default class Group {

  static async getAllGroups(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      const response = await data.client.getAllGroups();
      let groups = response.map(function (data) {
        return {
          'id': data.id.user,
          'name': data.name,
        }
      })
      return res.status(200).json({
        "result": 200,
        "groups": groups
      })
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async joinGroup(req, res) {
    let data = Sessions.getSession(req.body.session)
    if (!req.body.code) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": "URL de convite do grupo não foi informada"
      })
    }
    else {
      try {
        const response = await data.client.joinGroup(req.body.code)
        return res.status(200).json({
          'result': response.status,
          'id': response.status == 200 ? response.gid.user : '',
          "messages": "SUCCESS"
        })
      } catch (error) {
        return res.status(400).json({
          "result": 400,
          "status": "FAIL",
          "error": error
        })
      }
    }
  }

  static async createGroup(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)

      if (!req.body.name) {
        return res.status(400).json({
          "result": 400,
          "status": "FAIL",
          'reason': 'Deve ser informado o nome do Grupo'
        })
      }
      else
        if (!req.body.participants) {
          return res.status(400).json({
            "result": 400,
            "status": "FAIL",
            'reason': 'Deve ser informado ao menos um Participante'
          })
        }
        else {
          let participants = req.body.participants.split(',')
          let elements = participants.map(element => {
            element += '@c.us'
            return element
          });
          const response = await data.client.createGroup(req.body.name, elements);
          return res.status(200).json({
            'result': response.status,
            'id': response.status == 200 ? response.gid.user : '',
            'participants': response.status == 200 ? response.participants : []
          })
        }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async leaveGroup(req, res) {
    if (!req.body.groupid) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        'reason': 'groupid não informado'
      })
    }
    else {
      try {
        let data = Sessions.getSession(req.body.session)
        const g = '@g.us'
        await data.client.leaveGroup(req.body.groupid + g)
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      } catch (error) {
        return res.status(400).json({
          "result": 400,
          "status": "FAIL",
          "error": error
        })
      }
    }
  }

  static async getGroupMembers(req, res) {
    let data = Sessions.getSession(req.body.session)
    if (!req.body.groupid) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        'reason': 'groupid não informado'
      })
    }
    else {
      try {
        const g = '@g.us'
        const response = await data.client.getGroupMembers(req.body.groupid + g);
        let participants = response.map(function (response) {
          let object = {
            "phone": response.id.user,
            "name": response.name ? response.name : '',
            "pushname": response.isBusiness ? response.verifiedName : response.pushname,
            "isBusiness": response.isBusiness
          }
          return object
        })
        return res.status(200).json({
          "result": 200,
          "participants": participants
        })
      } catch (error) {
        return res.status(400).json({
          "result": 400,
          "status": "FAIL",
          "error": error
        })
      }
    }
  }

  static async addParticipant(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let number = req.body.number + '@c.us';
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        data.client.addParticipant(req.body.groupid + g, number);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "error": error
      })
    }
  }

  static async removeParticipant(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let number = req.body.number + '@c.us';
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        await data.client.removeParticipant(req.body.groupid + g, number);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async promoteParticipant(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let number = req.body.number + '@c.us';
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        await data.client.promoteParticipant(req.body.groupid + g, number);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async demoteParticipant(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      let number = req.body.number + '@c.us';
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        await data.client.demoteParticipant(req.body.groupid + g, number);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async getGroupAdmins(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        const response = await data.client.getGroupAdmins(req.body.groupid + g)
        let admins = response.map(function (response) {
          let object = {
            "phone": response.user,
          }
          return object
        })
        return res.status(200).json({
          "result": 200,
          "admins": admins
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async changePrivacyGroup(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        await data.client.setMessagesAdminsOnly(req.body.groupid + g);
        return res.status(200).json({
          "result": 200,
          "messages": "SUCCESS"
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async getGroupInviteLink(req, res) {
    try {
      let data = Sessions.getSession(req.body.session)
      if (!req.body.groupid) {
        return res.status(400).json({
          'result': 'error',
          'reason': 'Deve ser informado o ID do Grupo'
        })
      }
      else {
        const g = '@g.us'
        const response = await data.client.getGroupInviteLink(req.body.groupid + g)
        return res.status(200).json({
          "result": 200,
          "convite": response
        })
      }
    } catch (error) {
      return res.status(400).json({
        "result": 400,
        "status": "FAIL",
        "log": error
      })
    }
  }

  static async setGroupPic(req, res) {

    if (!req.body.path) {
      return res.status(400).send({
        status: 400,
        error: "Path não informado",
        message: "Informe o path. Exemplo: C:\\folder\\video.mp4 para arquivo local ou URL caso o arquivo a ser enviado esteja na internet"
      });
    }
    let data = Sessions.getSession(req.body.session)
    let number = req.body.number + '@g.us';
    let isURL = await urlExists(req.body.path);
    let name = req.body.path.split(/[\/\\]/).pop();
    try {
      if (isURL) {
        let dir = 'files-received/'
        await get(req.body.path, {
          directory: 'files-received'
        });

        let response = await data.client.setProfilePic(number, dir + name)
        fs.unlink(path.basename("/files-received") + "/" + name, erro => console.log(""))
        return res.status(200).json({
          result: 200,
          type: 'video',
          session: req.body.session,
          file: name,
          data: response
        })
      }
      if (!isURL) {

        let response = await data.client.setGroupPic(number, req.body.path)

        return res.status(200).json({
          result: 200,
          type: 'video',
          session: req.body.session,
          file: name,
          data: response
        })
      }

    } catch (error) {
      return res.status(500).json({
        result: 500,
        error: error
      })
    }
  }
}