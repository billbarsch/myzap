let url;
let host = '<%=host %>'
let host_ssl = '<%=host_ssl %>'
let port = '<%=port %>'
url = host_ssl == '' ? `http://${host}:${port}` : `https://${host_ssl}`

async function getSession(session) {
	const config = {
		headers: {
			apitoken: document.getElementById("apitoken").value,
			sessionkey: document.getElementById("sessionkey").value
		}
	}

	const data = {
		session: document.getElementById("session").value,
		wh_status: document.getElementById("wh_status").value,
		wh_message: document.getElementById("wh_message").value,
		wh_qrcode: document.getElementById("wh_qrcode").value,
		wh_connect: document.getElementById("wh_connect").value,
	}
	axios.post(url + "/start", data, config)
		.then((value) => {
			alert(value);
		}).catch((err) => {
			alert(err);
		});

}

async function alterSession(session) {
	document.getElementById('send-btn').disabled = false
	document.getElementById('image').src = "imagens/loading.gif"
	if (!session) {
		document.getElementById('send-btn').disabled = false
		document.getElementById('image').src = "imagens/readqrcode.jpg"

		alert("Digite o nome da sessão antes de continuar...")
	} else
		if (!document.getElementById('apitoken').value) {
			document.getElementById('send-btn').disabled = false
			document.getElementById('image').src = "imagens/readqrcode.jpg"

			alert("Digite o TOKEN da API antes de continuar...")
		} else
			if (!document.getElementById('sessionkey').value) {
				document.getElementById('send-btn').disabled = false
				document.getElementById('image').src = "imagens/readqrcode.jpg"

				alert("Digite a SESSION KEY da sessão antes de continuar...")
			}
			else {
				document.getElementById('image').style.visibility = "visible";
				document.getElementById('send-btn').disabled = true
				await getSession(session)
			}
}

const socket = io(url + '/', { transports: ['websocket'] });

socket.on('msg', (msg) => {
	if (msg) {
		document.getElementById('image').style.visibility = "hidden";
		document.getElementById('send-btn').disabled = false
		alert(msg.reason)
	}

});

socket.on('qrCode', (qrCode) => {
	let session = document.getElementById('session').value
	if (session === qrCode.session) {

		document.getElementById('image').src = qrCode.data
	}
});

socket.on('whatsapp-status', (status) => {
	if (status) {
		alert('Whatsapp Aberto com sucesso')
		document.getElementById('send-btn').disabled = false
		document.getElementById('image').src = "imagens/ok.jpg"
	}else {
		document.getElementById('send-btn').disabled = false
		document.getElementById('image').src = "imagens/error.jpg"
	}
});