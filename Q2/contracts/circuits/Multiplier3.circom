pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier3 () {  

   // Declaration of input and output signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;

   // Declaration of intermediate signal
   signal aux;

   // Constraints.
   // Breaks d <== a * b * c non-quadratic constraint into two quadratic constraints

   // First multiplies a and b, assigns the product to the intermediate signal aux
   // and checks if the product of a and b matches the value of aux 
   aux <== a * b;
   // Then multiplies aux and c, assigns the product to the ouput signal d
   // and checks if the product of aux and c matches the value of d
   d <== aux * c;  
}

component main = Multiplier3();
