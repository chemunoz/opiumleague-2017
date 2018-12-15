<h1>PICHICHI 00:26</h1>
<?php
// include('simple_html_dom.php');
// // $option = array(
// //       'http' => array(
// //           'method' => 'GET',
// //           'header' => 'User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
// //       )
// // );
// // Create DOM from URL or file
// // $html = file_get_html('http://www.google.com/');
// $html = file_get_html('http://www.comunio.es/');
// // echo $html;
//
// // Find all images
// foreach($html->find('img') as $element)
//        echo $element->src . '<br>';
//
// // Find all links
// foreach($html->find('a') as $element)
//        echo $element->href . '<br>';



// $curl = curl_init();
// curl_setopt($curl, CURLOPT_HEADER, 0);
// curl_setopt($curl, CURLOPT_RETURNTRANSFER,1);
// curl_setopt($curl, CURLOPT_URL, "https://www.pichichi.es/clasificacion-maximo-goleador-ligabbva/");
// $html=curl_exec($curl);
// $dom = new simple_html_dom(null, true, true, DEFAULT_TARGET_CHARSET, true, DEFAULT_BR_TEXT, DEFAULT_SPAN_TEXT);
// $html=$dom->load($html, true, true);
// echo $html;




// $ch = curl_init();
// // curl_setopt($ch, CURLOPT_URL , "https://www.pichichi.es/clasificacion-maximo-goleador-ligabbva/");
// curl_setopt($ch, CURLOPT_URL , "http://www.marca.com/");
// curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.A.B.C Safari/525.13");
// curl_setopt($ch, CURLOPT_HEADER, true);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
// curl_setopt($ch, CURLOPT_COOKIEFILE, "cookies.txt");
// curl_setopt($ch, CURLOPT_COOKIEJAR, "cookies.txt");
// $response= curl_exec ($ch);
// curl_close($ch);
//
// echo $response;




$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL,'http://www.futbolfantasy.com/');
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
$query = curl_exec($curl_handle);
curl_close($curl_handle);
echo "<pre/>";print_r($query);



// // Don't forget to include this library!
// require_once 'simple_html_dom.php';
// $option = array(
//       'http' => array(
//           'method' => 'GET',
//           'header' => 'User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
//       )
// );
// $context = stream_context_create($option);
// $simple_html_dom = new simple_html_dom();
// $simple_html_dom -> load_file('https://www.pichichi.es/clasificacion-maximo-goleador-ligabbva', false, $context);
// // var_dump($simple_html_dom);
// // Find all images
// foreach($simple_html_dom->find('td') as $element)
//        echo $element . '<br>';




// // Get the DOM from a given URL
// $html = file_get_html('http://cadenaser.com/emisora/2018/08/30/radio_valencia/1535638427_752539.html/');
// var_dump($html);
//
// // Step 1. Find all article links
// foreach($html->find('main article.preview h2 a') as $link) {
//
//     // Step 2. Get the DOM of each article from the WebDew.tech homepage
//     $article = file_get_html($link->href);
//
//     // Step 3. Display the first H1 tag from each webpage
//     echo $article->find('article h1')[0];
//
//     // Step 4. Display each paragraph from article below the H1 tag
//     foreach($article->find('article p') as $paragraph) {
//         echo $paragraph;
//     }
//
// }

?>
