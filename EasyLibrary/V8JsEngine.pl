<?php
class V8JsEngine implements IEngine {
    
    public function addObject($aliasName, $obj) {
        this.bindings = scriptEngine.getBindings(ScriptContext.ENGINE_SCOPE);
        this.bindings.put($aliasName, $obj);
    }

    public function execute($sScriptCode) {
        try {
            $compilable = (Compilable)scriptEngine;
            $compiledScript = compilable.compile(sScriptCode);
            $compiledScript.eval(this.bindings);
        }
        catch (ScriptException e) {
        }
    }

    public function invokeMethod($functionName, Object... $obj) {
        $result = "";
        try {
            $invocable = (Invocable)compiledScript.getEngine();
            $result = invocable.invokeFunction($functionName, $args);
        }
        catch (ScriptException | NoSuchMethodException e) {
            $text = e.getMessage();
        }

        return $result;
    }

    private static volatile CompiledScript compiledScript = null;
    private ScriptEngine scriptEngine =  null;
    private Bindings bindings = null;
    
    public JavaScriptEngine() {
        this.scriptEngine = new ScriptEngineManager().getEngineByName("JavaScript");
    }
}
?>
