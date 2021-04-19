<?php
error_reporting(E_ALL | E_STRICT);

require_once("myzap.class.php");
$myzap = new MyZap();

/**************************
 * **** MyZAP => VENOM ****
 *   test by @bgastaldi
 *************************/

/**
 * Start Session
 */
//print_r($myzap->start(['sessionName' => 'session1']));

/**
 * Close Session
 */
//print_r($myzap->close(['sessionName' => 'session1']));

/**
 * Get Status
 */
//print_r($myzap->status(['sessionName' => 'session1']));

/**
 * Get All Chats New Message
 */
//print_r($myzap->getAllChatsNewMsg(['sessionName' => 'session1']));

/**
 * Get All Unread Message
 */
//print_r($myzap->getAllUnreadMessages(['sessionName' => 'session1']));

/**
 * Check Number Status
 */
//print_r($myzap->checkNumberStatus(['sessionName' => 'session1', 'number' => '0000000000000']));

/**
 * Get Number Profile
 */
//print_r($myzap->getNumberProfile(['sessionName' => 'session1', 'number' => '0000000000000']));


/**
 * Get QrCode
 */
//print_r($myzap->qrcode(['sessionName' => 'session1', 'image' => 'true']));
//print_r($myzap->qrcode(['sessionName' => 'session1']));


/**
 * Send message
 */
//print_r($myzap->sendText(['sessionName' => 'session1', 'number' => '0000000000000', 'text' => 'Funciona']));

/**
 * Send File 
 * (Document)
 */
//print_r($myzap->sendFile(['sessionName' => 'session1', 'number' => '0000000000000', 'base64Data' => base64_encode(file_get_contents('teste.txt')), 'fileName' => 'teste.txt', 'caption' => 'See my Document']));

/**
 * Send File 
 * (Image)
 */
//print_r($myzap->sendFile(['sessionName' => 'session1', 'number' => '0000000000000', 'base64Data' => base64_encode(file_get_contents('venom.jpg')), 'fileName' => 'venom.jpg', 'caption' => 'See my Image']));

/**
 * Send Location 
 */
//print_r($myzap->sendLocation(['sessionName' => 'session1', 'number' => '0000000000000', 'lat' => '-23.5489', 'long' => '-46.6388', 'local' => 'Brasil']));

/**
 * Send Link 
 */
//print_r($myzap->sendLink(['sessionName' => 'session1', 'number' => '0000000000000', 'url' => 'https://github.com/billbarsch/myzap', 'caption' => 'MyZap']));

/**
 * Send Contact Vcard 
 */
//print_r($myzap->sendContactVcard(['sessionName' => 'session1', 'number' => '0000000000000', 'numberCard' => '0000000000001', 'nameCard' => 'ZeMulambo']));
