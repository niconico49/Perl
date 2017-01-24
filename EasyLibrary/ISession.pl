<?php
interface ISession {
    public function getAttribute($key);
    public function setAttribute($key, $value);
    public function removeAllAttribute();
}
?>
