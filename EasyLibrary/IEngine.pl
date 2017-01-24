<?php
interface IEngine {
    public function addObject($aliasName, $obj);
    public function execute($sScriptCode);
    public function invokeMethod($functionName, $obj);
}
?>
