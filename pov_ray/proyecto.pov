#include "colors.inc" 
#include "shapes.inc"
#include "textures.inc"
#include "stones.inc"
#include "skies.inc"


#declare Pigment_1 =
pigment{ gradient <0,1,0>  sine_wave
         color_map{
            [ 0.0 color rgb<1,1,1> ]
            [ 1.0 color rgb<1,0,0> ]
         }
         scale 0.35
} 
camera {
    location <0,1,-15>
    look_at <0,1,0>
    rotate <5, clock*(-410),5>
}

light_source {
    <4,6,-10>
    White
}
   
background{White}
 sky_sphere {
    pigment {
      gradient y
      color_map {
        [0.000 0.002 color rgb <1.0, 0.2, 0.0>
                     color rgb <1.0, 0.2, 0.0>]
        [0.002 0.200 color rgb <0.8, 0.1, 0.0>
                     color rgb <0.2, 0.2, 0.3>]
      }
      scale 2
      translate -1
    }
    pigment {
      bozo
      turbulence 0.65
      octaves 6
      omega 0.7
      lambda 2
      color_map {
          [0.0 0.1 color rgb <0.85, 0.85, 0.85>
                   color rgb <0.75, 0.75, 0.80>]
          [0.1 0.5 color rgb <0.80, 0.80, 0.85>
                   color rgbt <1, 1, 1, 1>]
          [0.5 1.0 color rgbt <1, 1, 1, 1>
                   color rgbt <1, 1, 1, 1>]
      }
      scale <0.2, 0.5, 0.2>
    }
    rotate -135*x
  }


plane{ 
    y,-1.0
    pigment { hexagon Gray20, Gray70, Black }  
}
light_source{
    <5,30,-30>
    White
}        
light_source{
    <5,-30,30>
    White shadowless
}

cone {
    <-6,1,0>,.3
    <-5,2,3>,1.0
    open
    texture{T_Stone5 scale 2}
    rotate  <clock*(-180),0,0>
    translate <+3,+2,0>
}
 
sphere {
    <-4,1,2>,1.5
    texture{
        pigment { rgb<0, 0, 1> transmit 0.7 }
        finish {phong 0}
    }
}   
  
sphere {
    <-8,1,2>,1.5
    texture { Polished_Chrome
        finish { 
            refraction 1 
            ior 1.33 
        }
    }  
}  

   /*
sphere {
    <-8,1,2>,1.5
    texture{
        pigment { rgb<0, 0, 1> filter 0.7}
    }
} 
*/

sphere {
    <-12,1,2>,1.5
    texture{
        pigment { rgb<0, 0, 1> transmit 0.5 }
    }
}


box {
    <0,0,0>,
    <4,4,4>
    texture{
        T_Stone25
        //Escalar la textura
        scale 19
    }
    rotate <0,20,0> //Rotar 20 grados respecto a eje Y
    //El sentido de los giros se hacen usando la regla de la mano izquierda
    rotate y*-15 //-15 grados en y
    rotate z*30 //30 grados en z
}   


blob {
     threshold 0.6
     sphere {<0.75, 0, 0>, 1.0, 1.0}
     sphere {<-0.375, 0.64952, 0>, 1.0, 1.0}
     sphere {<-0.375, -0.64952, 0>, 1.0, 1.0}
     texture {
        pigment {color red 1 blue 1 green 0}
        finish {phong 1}
     }
}