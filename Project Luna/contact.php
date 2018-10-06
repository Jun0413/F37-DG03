<?php
$config = array(
    'navLink' => 'contact',
    'styles' => array('./libs/css/pages/contact.css'),
    'scripts' => array('./libs/javascript/pages/contact.js')
);

require_once './api/config/database.php';
$database = new Database();
$db = $database->getConnection();

require_once './components/layout_header.php';
?>

    <main>
    </main>

<?php
require_once './components/layout_footer.php';
?>