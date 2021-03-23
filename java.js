const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');

let codeEditor = ace.edit("editorCode");

let defaultCode = 'class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}';
//let defaultCode = 'hello!';

let editorLib = {
    init() {
        codeEditor.setTheme("ace/theme/chrome");

        codeEditor.session.setMode("ace/mode/java");

        codeEditor.setOptions({
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
        });

        codeEditor.setValue(defaultCode);
    }
}

executeCodeBtn.addEventListener('click', () => {
    /*socket = new WebSocket(`ws://${host}:8000`);
    socket.addEventListener('message', (event) => { processCommand(event.data); });
    socket.send(codeEditor.getValue());
    const userCode = codeEditor.getValue();
    try {
        //console.log(userCode) ();
    } catch (err) {
        console.error(err);
    }*/
    ws.send(codeEditor.getValue());
});

const ws = new WebSocket('ws://localhost:8000/');
ws.onopen = function() {
    console.log('WebSocket Client Connected');
    //ws.send('Hi this is web client.');
};
ws.onmessage = function(e) {
  console.log("Received: '" + e.data + "'");
};

resetCodeBtn.addEventListener('click', () => {
    //codeEditor.setValue(defaultCode);
    new Doppio.VM.JVM({
        // '/sys' is the path to a directory in the BrowserFS file system with:
        // * vendor/java_home/*
        //doppioHomePath: '/sys',
        // Add the paths to your class and JAR files in the BrowserFS file system
        //classpath: ['.', '/sys/myStuff.jar', '/sys/classes']
      }, function(err, jvmObject) {
        // Called once initialization completes.
        // Run a particular class!
        // foo.bar.Baz *must* contain a public static void main method.
        jvm.runClass('java.txt', [], function(exitCode) {
          if (exitCode === 0) {
            // Execution terminated successfully
          } else {
            // Execution failed. :(
          }
        });
        });
    
});

editorLib.init();