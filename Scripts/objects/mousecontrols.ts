/* 
Author: Ryan Sterling 300509648-->
Source File Name: Comp 392 Assignment 03 -->
Last Modified By: Ryan Sterling 300509648-->
Date Last Modified By: April 17,2016 -->
Program Description: Jumping Justice-->
Revision History: https://github.com/ryans3/Comp392Assignment03 -->
*/



module objects {
    // MouseControls Class +++++++++++++++
    export class MouseControls {
        // PUBLIC INSTANCE VARIABLES +++++++++
        public sensitivity: number;
        public yaw: number; // look left and right - y-axis
        public pitch: number; // look up and down - x-axis
        public enabled: boolean;
        // CONSTRUCTOR +++++++++++++++++++++++
        constructor() {
            this.enabled = false;
            this.sensitivity = 0.4;
            this.yaw = 0;
            this.pitch = 0;
            
            document.addEventListener('mousemove', this.OnMouseMove.bind(this), false);
        }
        
        // PUBLIC METHODS +++++++++++++++++++++
        public OnMouseMove(event: MouseEvent):void {
            this.yaw = -event.movementX * this.sensitivity * 5;
            
            this.pitch = -event.movementY * this.sensitivity * 0.1;
        }
        
    }
}