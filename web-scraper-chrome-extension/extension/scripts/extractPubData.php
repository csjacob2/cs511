<?php
	$DEBUG=0;
	if ($DEBUG>0) {
		echo("====hello from the server " . gethostname() . " ====");
		if(function_exists('exec')) {
	    	echo "exec is enabled";
		}
	}
	
	if (strcmp(gethostname(),"kite.cs.illinois.edu")==0) {
		$java_dir='./java/jdk1.8.0_25/bin/java';
	} else {
		$java_dir='java';
	}

	$intializeAndEnforceConstraints=null;
	$intializeConstraintsSeparately=null;
	$enforceConstraints=null;
	
	$data=$_POST['data'];
	if (isset($_POST['intializeConstraintsSeparately'])) {
		$intializeConstraintsSeparately=$_POST['intializeConstraintsSeparately'];
	}
	if (isset($_POST['enforceConstraints'])) {
		$enforceConstraints=$_POST['enforceConstraints'];
		$enforceConstraints=str_replace('"', '\"', $enforceConstraints);
		$enforceConstraints = ' -constraintJson "' . $enforceConstraints . '"';
	} else {
		$enforceConstraints = '';
	}
	if (isset($_POST['intializeAndEnforceConstraints'])) {
		$intializeAndEnforceConstraints=$_POST['intializeAndEnforceConstraints'];
	}

	// echo ($intializeAndEnforceConstraints);
	// echo ($intializeConstraintsSeparately);
	// echo ($enforceConstraints);

	// echo $data;
	$temp_file = 'test.txt';
	file_put_contents($temp_file, $data);
	// echo (exec('ls ./stanfordnertest 2>&1'));
	// echo ('yay');
	exec('cat test.txt | perl -p -e "s/\n/ oOoOoOoOo\n/g" > test.tmp.txt');
	$tmp = $java_dir . ' -cp "./stanfordnertest/bin" edu.stanford.nlp.process.PTBTokenizer ./test.tmp.txt > ./test.tok.txt';
	// 2>&1
	// echo (exec('java'));
	// echo (file_get_contents('./test.tok.txt'));
	$tmp2 = exec($tmp);
	// echo ($tmp2);
	// echo (file_get_contents('./test.tok.txt'));
	// echo ($java_dir . ' -cp "stanfordnertest/bin" edu.stanford.nlp.process.PTBTokenizer test.tmp.txt > test.tok.txt');
	exec('cat test.tok.txt | perl -p -e "s/oOoOoOoOo//g" > test.tmp.txt');
	exec('cat test.tmp.txt > test.tok.txt');
	if ($intializeAndEnforceConstraints==1) {
		if ($intializeConstraintsSeparately==1) {
			$tmp2 = exec($java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -inferenceType FieldBasedViterbi -initializeAndEnforceFieldBasedConstraints true -ignoreInitialization true' . $enforceConstraints . ' -testFile test.tok.txt  > test.out.txt');
			$tmp2 = exec($java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -inferenceType FieldBasedViterbi -initializeAndEnforceFieldBasedConstraints true -ignoreEnforcement true' . $enforceConstraints . ' -testFile test.tok.txt  > test.constraints.txt');
			$tmp2 = $java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -inferenceType FieldBasedViterbi -initializeAndEnforceFieldBasedConstraints true -ignoreEnforcement true' . $enforceConstraints . ' -testFile test.tok.txt  > test.constraints.txt';
			file_put_contents('error.log.txt', $tmp2);
		} else {
			$tmp2 = exec($java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -inferenceType FieldBasedViterbi -initializeAndEnforceFieldBasedConstraints true ' . $enforceConstraints . ' -testFile test.tok.txt  > test.out.txt');	
		}		
	} else {
		$tmp2 = exec($java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -testFile test.tok.txt  > test.out.txt');
	}
	
	// $tmp2 = exec($java_dir . ' -cp "./stanfordnertest/bin" edu.stanford.nlp.ie.crf.CRFClassifier -prop ./stanfordnertest/script/all.prop -loadClassifier ./stanfordnertest/script/cora-at-model.ser.gz -inferenceType FieldBasedViterbi -initializeAndEnforceFieldBasedConstraints true -testFile test.tok.txt  > test.out.txt');
	// echo ($tmp2);
	// echo (file_get_contents('./test.out.txt'));
	exec($java_dir . ' -cp "./stanfordnertest/bin:./stanfordnertest/lib/*" com.longpham.crf.processing.FormatOutputToCSV');
	// 2>&1 > test.tmp.txt
	exec('cat test.out.csv | perl -p -e "s/-LRB-/(/g" | perl -p -e "s/-RRB-/)/g" > test.tmp.txt');
	exec('cat test.tmp.txt > test.out.csv');
	// echo ('<br>');
	echo (file_get_contents('test.out.csv'));
?>
