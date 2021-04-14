<?php

class MyZap {

	protected $options;
	function __construct($options = null) {

		//...ADD YOUR LOCAL HOST/IP
		$this->options = [
			'LOCAL_HOST' => 'http://192.168.1.155:3333'
		];

    }

	protected function getServerVar($id) {
        return isset($_SERVER[$id]) ? $_SERVER[$id] : '';
    }

    protected function header($str) {
        return $str;
    }

    public function head() {
        $this->header('Pragma: no-cache');
        if (strpos($this->getServerVar('HTTP_ACCEPT'), 'application/json') !== false) :
            $this->header('Content-type: application/json');
        else:
            $this->header('Content-type: text/plain');
        endif;
    }

    protected function body($str) {
        return json_encode($str);
    }

    protected function response($content, $print = true) {
    	if($print):
        	$this->head();
        	$this->body($content);
        endif;	
        return $content;
    }


    protected function sendCurl($method, $function, $data){
    	$ch = curl_init();
    	if($method == "post"):
			curl_setopt($ch, CURLOPT_URL, $this->options['LOCAL_HOST'].'/'.$function);
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
		else:
			curl_setopt($ch, CURLOPT_URL, $this->options['LOCAL_HOST'].'/'.$function.'?'.http_build_query($data));
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
		endif;	
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
			curl_setopt($ch, CURLOPT_TIMEOUT, 30);
			curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, [
		    		'Content-Type: application/json',
		    		'Cache-control: no-cache'
		    ]
			);	
		$result = curl_exec($ch);
		if($result === false):
    		echo 'Curl error: ' . curl_error($ch); 
    		die;
		endif;
		curl_close($ch);
		return $this->response($result);	
    }

    public function start($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function status($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function qrcode($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function close($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }


    public function getAllChatsNewMsg($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function getAllUnreadMessages($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function getNumberProfile($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }

    public function checkNumberStatus($data) {
    	return $this->sendCurl('get', __FUNCTION__ , $data);
    }
    
    public function sendText($data) {
    	return $this->sendCurl('post', __FUNCTION__ , $data);
    }

    public function sendFile($data) {
    	return $this->sendCurl('post', __FUNCTION__ , $data);
    }

    public function sendLocation($data) {
    	return $this->sendCurl('post', __FUNCTION__ , $data);
    }

    public function sendLink($data) {
    	return $this->sendCurl('post', __FUNCTION__ , $data);
    }

    public function sendContactVcard($data) {
    	return $this->sendCurl('post', __FUNCTION__ , $data);
    }



}
