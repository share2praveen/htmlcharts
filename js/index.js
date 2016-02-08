/*
 * Graph visualization
 */
var graphs = {
	/*
	 * List of graphs for single poll questions
	 */
	
	singlePoll: {

		gender: {
			// Poll details
			data: {
				pid: "pid123", // poll id 
				x1: 5,         // total answers for q1 

				// total votes and gender based classification
				_x1: {total: 3200, m: 1600, f: 1600, c: "003366"},

				// total votes and gender based classification
				_1a: {total: 70, m: 40, f: 30, c: "fd3331"},
				_1b: {total: 60, m: 20, f: 40, c: "3ef626"},
				_1c: {total: 50, m: 30, f: 20, c: "3f32f3"},
				_1d: {total: 70, m: 50, f: 20, c: "ff32f1"},
				_1e: {total: 70, m: 20, f: 50, c: "3ef2f1"}
			},

			//
			// Expecting the objects to in an easier array format like
			//  data_array [{_x1, _1a _1b, _1c, _1d, _1e}]
			//
			data_array: [{total: 3200, m: 1600, f: 1600, c: "003366"}, 
							  {total: 70, m: 40, f: 30, c: "6cc930"},
							  {total: 60, m: 20, f: 40, c: "ce308f"},
							  {total: 50, m: 30, f: 20, c: "9933ba"},
							  {total: 70, m: 50, f: 20, c: "fc4c8c"},
							  {total: 70, m: 60, f: 10, c: "fa8d38"}
							 ],

			alphabets: "abcdefghijklmnopqrstuvwxyz".split(''),
			mid_axis_values: ["Σ"],

			/*
			 * later we can add pass the data as parameters
			 */
			draw: function () {
				var total_no_answers = this.data.x1;

				// plot mid points 
				// -----> begins here
				for (var i=0; i<total_no_answers; i++) {
					var op = 1 + this.alphabets[i];
					this.mid_axis_values.push(op);
				}

				for (var j=0; j<this.mid_axis_values.length; j++) {
					var ele = document.createElement('div');
					ele.className = "mid-axis";
					ele.innerHTML = this.mid_axis_values[j];
					document.getElementById('vaxis').appendChild(ele);
				}
				// -----> ends here
				
				

			 	for (var  k=0; k<this.data_array.length; k++) {				
					var malePercentage = this.calculateNormalizedPercentage(this.data_array[k].m, this.data_array[k].total);
					var femalePercentage = this.calculateNormalizedPercentage(this.data_array[k].f, this.data_array[k].total);

					var left_axis = document.createElement('div');
					left_axis.className = "left-side-bar";
					left_axis.style.backgroundColor = "#" + this.data_array[k].c;
					left_axis.style.width = malePercentage + "%";
					document.getElementById("left").appendChild(left_axis);

					var right_axis = document.createElement('div');
					right_axis.className = "right-side-bar";
					right_axis.style.backgroundColor = "#" + this.data_array[k].c;
					right_axis.style.width = femalePercentage + "%";
					document.getElementById("right").appendChild(right_axis);
				}
			},


			calculateNormalizedPercentage: function (theVal, theTotal) {
				return (theVal / theTotal) * 100;
			}
		},
		
		weekly: {

			// Poll Data
			data: [{day: 1, Total: 124}, 
				   {day: 2, Total: 276}, 
				   {day: 3, Total: 135}, 
				   {day: 4, Total: 551}, 
				   {day: 5, Total: 20}, 
				   {day: 6, Total: 0}, 
				   {day: 7, Total: 30}
				   ],
		   	total_days: 7,
		   	total_yaxis_lines: 4,


			CANVAS: null,
			CONTEXT: null,
			X_PAD: 20,
			Y_PAD: 30,
			xSpacing: null,
			ySpacing: null,
			divident: null,

			draw: function () {
				this.CANVAS = document.getElementById('weekly_graph');
				this.CONTEXT = this.CANVAS.getContext("2d");
				// Need to fix the innerwidth to avoid scrollbar
				this.CANVAS.width = window.innerWidth - 30;
				this.CANVAS.height = window.innerHeight - 30;

				this.xSpacing = (this.CANVAS.width - this.X_PAD) / this.total_days;
				this.ySpacing = (this.CANVAS.height - this.Y_PAD) / this.total_yaxis_lines;

				// Finding out the maximum number in the given data
				var temp_max = 0;
				var max = 0;
				var temp_array = [];
				for (var i=0; i<this.data.length; i++) {
					temp_array.push(this.data[i].Total);
					if (this.data[i].Total > max) {
						max = this.data[i].Total;
					}
				}
				temp_array = temp_array.sort(function (a, b) {
					return a - b;
				});
				temp_max = max;
				max = Math.ceil(max / 10) * 10;
				this.divident = Math.round(max / this.total_yaxis_lines);

				// Fill out the Xaxis
				for (var i = 0; i < this.total_days; i++) {
			         this.CONTEXT.fillText("Day" + this.data[i].day, this.xRect(i) + this.xSpacing / 2 -10, this.CANVAS.height - 5);
			     }

			     // Draw Y axis data with lines
			     for (var i=0; i<=this.total_yaxis_lines; i++) {
			     	if (i === this.total_yaxis_lines) {
			     		this.CONTEXT.fillText(max, this.X_PAD - 20, this.CANVAS.height - this.Y_PAD + 10 - (this.ySpacing * (i)));
			     	} else {
			     		this.CONTEXT.fillText(this.divident * i, this.X_PAD - 20, this.CANVAS.height - this.Y_PAD + 10 - (this.ySpacing * (i)));
			     	}
			     	this.CONTEXT.beginPath();
			     	this.CONTEXT.lineWidth = 0.2;
			     	if (i === 0) this.CONTEXT.lineWidth = 0.5;
			     	this.CONTEXT.moveTo(this.X_PAD, this.CANVAS.height - this.Y_PAD - (this.ySpacing * (i)));
			     	this.CONTEXT.lineTo(this.CANVAS.width, this.CANVAS.height - this.Y_PAD - (this.ySpacing * (i)));
			     	this.CONTEXT.closePath();
			     	this.CONTEXT.stroke();
			     }
			     this.CONTEXT.beginPath();
			     this.CONTEXT.lineWidth = 0.5;

			     // Draw a line graph inside the canvas section
			     for (var i = 0; i < this.total_days; i++) {
			         this.CONTEXT.strokeStyle = '#208D86';			         
			         this.CONTEXT.lineTo(this.xRect(i) + this.xSpacing / 2, this.getYAxis(this.data[i].Total));
			     }
			     this.CONTEXT.stroke();
			     this.CONTEXT.fillStyle = '#0489B1';

			     // Draw a circle as a plotted dots
			     for (var i=0; i<this.total_days; i++) {
			     	this.CONTEXT.beginPath();
			     	if (this.data[i].Total === temp_max) {
			     		this.CONTEXT.arc(this.xRect(i) + this.xSpacing /2, this.getYAxis(this.data[i].Total) + 6, 6, 0, Math.PI * 2, true);
			     	} else {
			     		this.CONTEXT.arc(this.xRect(i) + this.xSpacing / 2, this.getYAxis(this.data[i].Total), 6, 0, Math.PI * 2, true);			     		
			     	}
			     	this.CONTEXT.fill();			     	
			     }



			},

			xRect: function (theVal) {
				return this.X_PAD + (this.xSpacing * theVal);
			},

			yRect: function (theVal) {
				return (this.CANVAS.height - this.Y_PAD) - this.ySpacing * (theVal + 1);
			},

			getYAxis: function (theVal) {
				return this.CANVAS.height - (((this.CANVAS.height - this.Y_PAD) / (this.divident * this.total_yaxis_lines)) * theVal) - this.Y_PAD;
			}
		}
	},
	/*
	 * List of graphs for correlation poll questions
	 */
	dualPoll: {

		stackedBar: {

			// Poll details
			data: {
		        pid: "pid1234", //poll id
		        x1: 7, // total answers for q1
		        x2: 7, //total answers for q2

		        _x1: {total: 100},


		        // for answer 1
		        _1a: {total: 20, c: ""},
		        _1b: {total: 30, c: ""},
		        _1c: {total: 5, c: ""},
		        _1d: {total: 10, c: ""},
		        _1e: {total: 10, c: ""},
		        _1f: {total: 25, c: ""},
		        _1g: {total: 0, c: ""},

		        // for answer 2
		        _2a: {total: 40, c: ""},
		        _2b: {total: 5, c: ""},
		        _2c: {total: 10, c: ""},
		        _2d: {total: 10, c: ""},
		        _2e: {total: 20, c: ""},
		        _2f: {total: 5, c: ""},
		        _2g: {total: 10, c: ""},

		        // q1 E q2
		        _1a_2a: 10,
		        _1a_2b: 5,
		        _1a_2c: 2,
		        _1a_2d: 2,
		        _1a_2e: 1,
		        _1a_2f: 0,
		        _1a_2g: 0,

		        _1b_2a: 10,
		        _1b_2b: 0,
		        _1b_2c: 5,
		        _1b_2d: 5,
		        _1b_2e: 5,
		        _1b_2f: 0,
		        _1b_2g: 5,

		        _1c_2a: 2,
		        _1c_2b: 0,
		        _1c_2c: 0,
		        _1c_2d: 0,
		        _1c_2e: 1,
		        _1c_2f: 0,
		        _1c_2g: 2,

		        _1d_2a: 2,
		        _1d_2b: 0,
		        _1d_2c: 2,
		        _1d_2d: 1,
		        _1d_2e: 3,
		        _1d_2f: 0,
		        _1d_2g: 2,

		        _1e_2a: 2,
		        _1e_2b: 0,
		        _1e_2c: 0,
		        _1e_2d: 2,
		        _1e_2e: 5,
		        _1e_2f: 0,
		        _1e_2g: 1,

		        _1f_2a: 14,
		        _1f_2b: 0,
		        _1f_2c: 1,
		        _1f_2d: 0,
		        _1f_2e: 0,
		        _1f_2f: 0,
		        _1f_2g: 0,

		        _1g_2a: 0,
		        _1g_2b: 0,
		        _1g_2c: 0,
		        _1g_2d: 0,
		        _1g_2e: 0,
		        _1g_2f: 0,
		        _1g_2g: 0,
			},

			//
			// an array in a format like below so I can handle it color, position, total
			// x1_array [_x1, _1a, _1b, _1c, _1d, _1e, _1f, _1g]
			//
			//                                      
			x1_array: [{total: 20, c: "c47c32"}, 
			                {total: 30, c: "fa8d38"}, 
			                {total: 5, c: "fff232"}, 
			                {total: 10, c: "ce308f"}, 
			                {total: 10, c: "618cf5"}, 
			                {total: 25, c: "fc4c8c"}, 
			                {total: 0,  c: "6cc930"}],

			x2_array: [{total: 40, c: "108070"}, 
			                {total: 5, c: "1FE3C7"}, 
			                {total: 10, c: "83F0E0"}, 
			                {total: 10, c: "2A8E82"}, 
			                {total: 20, c: "51CBBD"}, 
			                {total: 5,  c: "9EE2DA"}, 
			                {total: 10, c: "A5C5B6"}],

        	//
			// for getting the correlation data it would be better to have data in array 
			//
			corr_data_relation: {
			    q1Eq2: [ // --- correlation between q1 and q2
			        [10, 5, 2, 2, 1, 0, 0],
			        [10, 0, 5, 5, 5, 0, 5],
			        [2, 0, 0, 0, 1, 0, 2],
			        [2, 0, 2, 1, 3, 0, 2],
			        [2, 0, 0, 2, 5, 0, 1],
			        [14, 0, 1, 0, 5, 5, 0],
			        [0, 0, 0, 0, 0, 0, 0]
			    ]
			},


			MAX: null,


			// Currently correlated based on q1Eq2
			// need to update the method to work vice versa
			// Later: the above poll details can be passed as parameter 
			draw: function () {
				this.MAX = this.findMaxInArray(this.x1_array);

				for (var i=0; i<this.x1_array.length; i++) {
					
					//
					// Create bar for x1 question (LEFT)
					//
					
					var left = document.createElement('div');
					left.className = "left-correlation-bar";
					left.style.width = this.calculateNormalizedPercentage(this.x1_array[i].total, this.MAX) + "%";
					left.style.backgroundColor = "#" + this.x1_array[i].c;
					document.getElementById("correlation-left").appendChild(left);

					//
			        // Create inner-bars for x2 question (RIGHT)
			        //

			        var right = document.createElement('div');
			        right.style.width = "100%";
			        right.style.height = "30px";
			        right.style.marginTop = "10px";
			        document.getElementById("correlation-right").appendChild(right);

			        //
			        // Create stacked bars within the inner-bars of x2 (RIGHT)
			        //

			        var _q1Eq2 = this.corr_data_relation.q1Eq2[i];
			        for (var j = 0; j < _q1Eq2.length; j++) {			        
			            var right_inner = document.createElement('div');
			            right_inner.className = "inner-right-correlation-bar";
			            right_inner.style.backgroundColor = "#" + this.x2_array[j].c;
			            right_inner.style.width = this.calculateNormalizedPercentage(_q1Eq2[j], this.x1_array[i].total) + "%";
			            right.appendChild(right_inner);
			        }
				}
			},

			// To find the max within the array of the object
			findMaxInArray: function (theArray) {
				var temp_array = [];
		        for (var i = 0; i < theArray.length; i++) {
		            temp_array.push(theArray[i].total);
		        }
		        
		        return Math.max.apply(Math, temp_array); 
			},

			calculateNormalizedPercentage: function (theVal, theTotal) {
				return (theVal / theTotal) * 100;
			}
		},

		circularBlob: {
			// Poll details
			
            x1_array: [{ total: 20, c: "7f5966"}, 
            		   { total: 30, c: "40d89b"}, 
            		   { total: 5, c: "426e71"}, 
            		   {total: 10, c: "3d8ebd"}, 
            		   {total: 10, c: "bfd832"}, 
            		   {total: 25, c: "9e905f"}, 
            		   {total: 0, c: "f6b58b"}],

            x2_array: [{total: 40, c: "108070"}, 
            		   {total: 5, c: "1FE3C7"}, 
            		   {total: 10, c: "83F0E0"}, 
            		   {total: 10, c: "2A8E82"}, 
            		   {total: 20, c: "51CBBD"}, 
            		   {total: 5, c: "9EE2DA"}, 
            		   {total: 10, c: "A5C5B6"}],
            data: {
                q2Eq1: [
                    [10, 20, 52, 32, 12, 134, 90],
                    [55, 60, 10, 20, 90, 0, 30, ],
                    [72, 65, 50, 82, 60, 31, 20],
                    [22, 35, 80, 41, 52, 70, 90],
                    [41, 35, 61, 73, 25, 75, 30],
                    [90, 20, 50, 60, 20, 45, 0],
                    [30, 15, 72, 82, 51, 90, 20]
                ]
            },
            q1_total_answers: 7,
            q2_total_answers: 7,
            alphabets: "ABCDEFGHIJLMNOPQRSTUVWXYZ".split(''),

			CANVAS: document.getElementById('blob_graph'),
			X_PAD: 30,
			Y_PAD: 30,
			xSpacing: null,
			ySpacing: null,
			max_radius: null,

			draw: function () {
				var CONTEXT = this.CANVAS.getContext("2d");
				this.CANVAS.width = window.innerWidth - 30;
				this.CANVAS.height = window.innerHeight - 30;

				this.xSpacing = (this.CANVAS.width - this.X_PAD) / this.q1_total_answers;
				this.ySpacing = (this.CANVAS.height - this.Y_PAD) / this.q2_total_answers;
				this.max_radius = Math.round(Math.min(this.xSpacing, this.ySpacing) / 2) - 2;

				//
                // Draw x and y axis
                //         
                CONTEXT.strokeStyle = "#000000";
                CONTEXT.translate(0.5, 0.5);
                CONTEXT.font = "12px bold RobotoSlab";
                CONTEXT.beginPath();
                CONTEXT.moveTo(this.X_PAD, 0);
                CONTEXT.lineTo(this.X_PAD, this.CANVAS.height - this.Y_PAD);
                CONTEXT.lineTo(this.CANVAS.width, this.CANVAS.height - this.Y_PAD);
                CONTEXT.stroke();

                //
                // -- Add text to x and y axis
                //

                for (var i = 0; i < this.q1_total_answers; i++) {
                    CONTEXT.fillText("1" + this.alphabets[i], this.xRect(i) + this.xSpacing / 2, this.CANVAS.height - 20);
                }

                for (var i = 0; i < this.q2_total_answers; i++) {
                    CONTEXT.fillText("2" + this.alphabets[i], this.X_PAD - 20, this.yRect(i) + this.ySpacing / 2);
                }

                for (var i = 0; i < this.q2_total_answers; i++) {

                        var cor_data = this.data.q2Eq1[i];

                        var max = Math.max.apply(Math, cor_data);
                        for (var j = 0; j < this.q1_total_answers; j++) {

                            // Radius calculation
                            // radius = cor_Data / maximum value * maximum radius

                            var radius = (cor_data[j] / max) * this.max_radius;

                            CONTEXT.fillStyle = "#" + this.x1_array[j].c;
                            CONTEXT.beginPath();
                            // Draw circle using the mid-point of the rectangle
                            CONTEXT.arc(this.xRect(j) + this.xSpacing / 2, this.yRect(i) + this.ySpacing / 2, radius, 0, Math.PI * 2, false);
                            CONTEXT.lineWidth = 1.5;
                            CONTEXT.fill();
                        }
                    }
			},

			xRect: function(val) {
                return this.X_PAD + (this.xSpacing * val);
        	},

            yRect: function(val) {
                return (this.CANVAS.height - this.Y_PAD) - this.ySpacing * (val + 1);
            }
		},

		concurrence: {
			
			// Poll details
			q1_total_answers: 7,
			q2_total_answers: 7,

			x1_array: [
                        {total: 20, c: "c47c32"}, 
                        {total: 30, c: "fa8d38"}, 
                        {total: 5, c: "fff232"}, 
                        {total: 10, c: "ce308f"}, 
                        {total: 10, c: "618cf5"}, 
                        {total: 25, c: "fc4c8c"}, 
                        {total: 0, c: "6cc930"}],

	        x2_array: [
                        {total: 40, c: "108070"},
                        {total: 5, c: "1FE3C7"},
                        {total: 10, c: "83F0E0"},
                        {total: 10, c: "2A8E82"},
                        {total: 20, c: "51CBBD"},
                        {total: 5, c: "9EE2DA"},
                        {total: 10, c: "A5C5B6"}
                        ],

	        data: {q2Eq1: [
                    [10, 20, 52, 32, 12, 134, 90],
                    [55, 60, 10, 20, 90, 0, 30, ],
                    [72, 65, 50, 82, 60, 31, 20],
                    [22, 35, 80, 41, 52, 70, 90],
                    [41, 35, 61, 73, 25, 75, 30],
                    [90, 20, 50, 60, 20, 45, 0],
                    [30, 15, 72, 82, 51, 90, 20]
	            ]},

            alphabets: "ABCDEFGHIJLMNOPQRSTUVWXYZ".split(''),
            //
			// Dummy dark color as max rgb color
			// Dummy light color as min rgb color
			//
			max_color: "244,109,67".split(","),
			min_color: "246,250,170".split(","),


			CANVAS: document.getElementById('concurrence_graph'),
			X_PAD: 30,
			Y_PAD: 30,
			xSpacing: null,
			ySpacing: null,


			draw: function () {
				var CONTEXT = this.CANVAS.getContext("2d");

				//need to fix the innerwidth to avoid scrollbar
	            this.CANVAS.width = window.innerWidth - 30;
	            this.CANVAS.height = window.innerHeight - 30;

	            this.xSpacing = (this.CANVAS.width - this.X_PAD) / this.q1_total_answers;
            	this.ySpacing = (this.CANVAS.height - this.Y_PAD) / this.q2_total_answers;

            	//
	            // Draw x and y axis
	            //         
	            CONTEXT.strokeStyle = "#000000";
	            CONTEXT.font = "12px bold RobotoSlab";
	            CONTEXT.beginPath();
	            CONTEXT.moveTo(this.X_PAD, 0);
	            CONTEXT.lineTo(this.X_PAD, this.CANVAS.height - this.Y_PAD);
	            CONTEXT.lineTo(this.CANVAS.width, this.CANVAS.height - this.Y_PAD);
	            CONTEXT.stroke();

	            //
		        // Add text to x and y axis
		        //		        
		        for(var i=0; i<this.q1_total_answers; i++) {
		           CONTEXT.fillText("1" + this.alphabets[i], this.xRect(i) + this.xSpacing/2, this.CANVAS.height-20);
		        }

		        for(var i=0; i<this.q2_total_answers; i++) {		        
		            CONTEXT.fillText("2" + this.alphabets[i], this.X_PAD - 20, this.yRect(i) + this.ySpacing/2);
		        }

		        for (var i=0; i<this.q2_total_answers; i++) {
					var cor_data = this.data.q2Eq1[i];
	                var max = Math.max.apply(Math, cor_data);
	                for (var j=0; j<this.q1_total_answers; j++) {
	                    // for rectangle calculations ---> starts
	                    // 
						var max_scale = (cor_data[j] / max).toFixed(1);
						var min_scale = (1 - max_scale).toFixed(1);
						
						// rgb calculation for each grid
						var r = Math.round((this.max_color[0] * max_scale) + (this.min_color[0] * min_scale));
						var g = Math.round((this.max_color[1] * max_scale) + (this.min_color[1] * min_scale));
						var b = Math.round((this.max_color[2] * max_scale) + (this.min_color[2] * min_scale));
						var code = "rgb(" + r + "," + g + "," + b + ")";
						
	                    CONTEXT.fillStyle = code;
	                    CONTEXT.fillRect(this.xRect(j), this.yRect(i), this.xSpacing, this.ySpacing);               
	                    //
	                    // ---> ends
	                }
	            }

			},

			xRect: function (val) {
                return this.X_PAD + (this.xSpacing * val);
            },
            yRect: function (val) {
                return (this.CANVAS.height - this.Y_PAD) - this.ySpacing * (val + 1);
            }

		}
	}
 };

/*
 * Make sure you maintain the responsive for multiple screens
 */

 window.addEventListener('resize', function() {
	graphs.singlePoll.weekly.draw();	 	
	graphs.dualPoll.concurrence.draw();
	graphs.dualPoll.circularBlob.draw();
 }, false);

 /*
  * Make sure you maintain the responsive for orientation change
  */
 window.addEventListener('orientationchange', function() {
	graphs.singlePoll.weekly.draw();	 	
	graphs.dualPoll.concurrence.draw();
	graphs.dualPoll.circularBlob.draw();
 }, false);

// Initial Call
graphs.singlePoll.weekly.draw();	 	

graphs.dualPoll.concurrence.draw();
graphs.dualPoll.circularBlob.draw();
graphs.dualPoll.stackedBar.draw();
graphs.singlePoll.gender.draw();