define(function(require, exports, module) {
	var ScrollPic=function(a, e, d, c, b) {
		this.scrollContId = a;
		this.arrLeftId = e;
		this.arrRightId = d;
		this.dotListId = c;
		this.listType = b;
		this.dotClassName = "dotItem";
		this.dotOnClassName = "dotItemOn";
		this.dotObjArr = [];
		this.listEvent = "onclick";
		this.circularly = true;
		this.pageWidth = 0;
		this.frameWidth = 0;
		this.speed = 10;
		this.space = 10;
		this.upright = false;
		this.pageIndex = 0;
		this.autoPlay = true;
		this.autoPlayTime = 5;
		this._autoTimeObj;
		this._scrollTimeObj;
		this._state = "ready";
		this.stripDiv = document.createElement("DIV");
		this.lDiv01 = document.createElement("DIV");
		this.lDiv02 = document.createElement("DIV")
	}
	ScrollPic.prototype = {
		version: "1.45",
		author: "mengjia",
		pageLength: 0,
		touch: true,
		scrollLeft: 0,
		eof: false,
		bof: true,
		initialize: function() {
			var b = this;
			if (!this.scrollContId) {
				//throw new Error("必须指定scrollContId.");
				return
			}
			this.scDiv = this.$(this.scrollContId);
			if (!this.scDiv) {
				//throw new Error('scrollContId不是正确的对象.(scrollContId = "' + this.scrollContId + '")');
				return
			}
			this.scDiv.style[this.upright ? "height" : "width"] = this.frameWidth + "px";
			this.scDiv.style.overflow = "hidden";
			this.lDiv01.innerHTML = this.scDiv.innerHTML;
			this.scDiv.innerHTML = "";
			this.scDiv.appendChild(this.stripDiv);
			this.stripDiv.appendChild(this.lDiv01);
			if (this.circularly) {
				this.stripDiv.appendChild(this.lDiv02);
				this.lDiv02.innerHTML = this.lDiv01.innerHTML;
				this.bof = false;
				this.eof = false
			}
			this.stripDiv.style.overflow = "hidden";
			this.stripDiv.style.zoom = "1";
			this.stripDiv.style[this.upright ? "height" : "width"] = "32766px";
			this.lDiv01.style.overflow = "hidden";
			this.lDiv01.style.zoom = "1";
			this.lDiv02.style.overflow = "hidden";
			this.lDiv02.style.zoom = "1";
			if (!this.upright) {
				this.lDiv01.style.cssFloat = "left";
				this.lDiv01.style.styleFloat = "left"
			}
			this.lDiv01.style.zoom = "1";
			if (this.circularly && !this.upright) {
				this.lDiv02.style.cssFloat = "left";
				this.lDiv02.style.styleFloat = "left"
			}
			this.lDiv02.style.zoom = "1";
			this.addEvent(this.scDiv, "mouseover", function() {
				b.stop()
			});
			this.addEvent(this.scDiv, "mouseout", function() {
				b.play()
			});
			if (this.arrLeftId) {
				this.alObj = this.$(this.arrLeftId);
				if (this.alObj) {
					this.addEvent(this.alObj, "mousedown", function(f) {
						b.rightMouseDown();
						f = f || event;
						b.preventDefault(f)
					});
					this.addEvent(this.alObj, "mouseup", function() {
						b.rightEnd()
					});
					this.addEvent(this.alObj, "mouseout", function() {
						b.rightEnd()
					})
				}
			}
			if (this.arrRightId) {
				this.arObj = this.$(this.arrRightId);
				if (this.arObj) {
					this.addEvent(this.arObj, "mousedown", function(f) {
						b.leftMouseDown();
						f = f || event;
						b.preventDefault(f)
					});
					this.addEvent(this.arObj, "mouseup", function() {
						b.leftEnd()
					});
					this.addEvent(this.arObj, "mouseout", function() {
						b.leftEnd()
					})
				}
			}
			var a = Math.ceil(this.lDiv01[this.upright ? "offsetHeight" : "offsetWidth"] / this.frameWidth),
				d, c;
			this.pageLength = a;
			if (this.dotListId) {
				this.dotListObj = this.$(this.dotListId);
				this.dotListObj.innerHTML = "";
				if (this.dotListObj) {
					for (d = 0; d < a; d++) {
						c = document.createElement("span");
						this.dotListObj.appendChild(c);
						this.dotObjArr.push(c);
						if (d == this.pageIndex) {
							c.className = this.dotOnClassName
						} else {
							c.className = this.dotClassName
						} if (this.listType == "number") {
							c.innerHTML = d + 1
						} else {
							if (typeof(this.listType) == "string") {
								c.innerHTML = this.listType
							} else {
								c.innerHTML = ""
							}
						}
						c.title = "第" + (d + 1) + "页";
						c.num = d;
						c[this.listEvent] = function() {
							b.pageTo(this.num)
						}
					}
				}
			}
			this.scDiv[this.upright ? "scrollTop" : "scrollLeft"] = 0;
			if (this.autoPlay) {
				this.play()
			}
			this._scroll = this.upright ? "scrollTop" : "scrollLeft";
			this._sWidth = this.upright ? "scrollHeight" : "scrollWidth";
			if (typeof(this.onpagechange) === "function") {
				this.onpagechange()
			}
			this.iPad()
		},
		leftMouseDown: function() {
			if (this._state != "ready") {
				return
			}
			var a = this;
			this._state = "floating";
			clearInterval(this._scrollTimeObj);
			this._scrollTimeObj = setInterval(function() {
				a.moveLeft()
			}, this.speed);
			this.moveLeft()
		},
		rightMouseDown: function() {
			if (this._state != "ready") {
				return
			}
			var a = this;
			this._state = "floating";
			clearInterval(this._scrollTimeObj);
			this._scrollTimeObj = setInterval(function() {
				a.moveRight()
			}, this.speed);
			this.moveRight()
		},
		moveLeft: function() {
			if (this._state != "floating") {
				return
			}
			if (this.circularly) {
				if (this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth]) {
					this.scDiv[this._scroll] = this.scDiv[this._scroll] + this.space - this.lDiv01[this._sWidth]
				} else {
					this.scDiv[this._scroll] += this.space
				}
			} else {
				if (this.scDiv[this._scroll] + this.space >= this.lDiv01[this._sWidth] - this.frameWidth) {
					this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
					this.leftEnd()
				} else {
					this.scDiv[this._scroll] += this.space
				}
			}
			this.accountPageIndex()
		},
		moveRight: function() {
			if (this._state != "floating") {
				return
			}
			if (this.circularly) {
				if (this.scDiv[this._scroll] - this.space <= 0) {
					this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] - this.space
				} else {
					this.scDiv[this._scroll] -= this.space
				}
			} else {
				if (this.scDiv[this._scroll] - this.space <= 0) {
					this.scDiv[this._scroll] = 0;
					this.rightEnd()
				} else {
					this.scDiv[this._scroll] -= this.space
				}
			}
			this.accountPageIndex()
		},
		leftEnd: function() {
			if (this._state != "floating" && this._state != "touch") {
				return
			}
			this._state = "stoping";
			clearInterval(this._scrollTimeObj);
			var a = this.pageWidth - this.scDiv[this._scroll] % this.pageWidth;
			this.move(a)
		},
		rightEnd: function() {
			if (this._state != "floating" && this._state != "touch") {
				return
			}
			this._state = "stoping";
			clearInterval(this._scrollTimeObj);
			var a = -this.scDiv[this._scroll] % this.pageWidth;
			this.move(a)
		},
		move: function(c, e) {
			var a = this;
			var f = c / 5;
			var d = false;
			if (!e) {
				if (f > this.space) {
					f = this.space
				}
				if (f < -this.space) {
					f = -this.space
				}
			}
			if (Math.abs(f) < 1 && f != 0) {
				f = f >= 0 ? 1 : -1
			} else {
				f = Math.round(f)
			}
			var b = this.scDiv[this._scroll] + f;
			if (f > 0) {
				if (this.circularly) {
					if (this.scDiv[this._scroll] + f >= this.lDiv01[this._sWidth]) {
						this.scDiv[this._scroll] = this.scDiv[this._scroll] + f - this.lDiv01[this._sWidth]
					} else {
						this.scDiv[this._scroll] += f
					}
				} else {
					if (this.scDiv[this._scroll] + f >= this.lDiv01[this._sWidth] - this.frameWidth) {
						this.scDiv[this._scroll] = this.lDiv01[this._sWidth] - this.frameWidth;
						this._state = "ready";
						d = true
					} else {
						this.scDiv[this._scroll] += f
					}
				}
			} else {
				if (this.circularly) {
					if (this.scDiv[this._scroll] + f < 0) {
						this.scDiv[this._scroll] = this.lDiv01[this._sWidth] + this.scDiv[this._scroll] + f
					} else {
						this.scDiv[this._scroll] += f
					}
				} else {
					if (this.scDiv[this._scroll] + f <= 0) {
						this.scDiv[this._scroll] = 0;
						this._state = "ready";
						d = true
					} else {
						this.scDiv[this._scroll] += f
					}
				}
			}
			this.accountPageIndex();
			if (d) {
				this.accountPageIndex("end");
				return
			}
			c -= f;
			if (Math.abs(c) == 0) {
				this._state = "ready";
				if (this.autoPlay) {
					this.play()
				}
				this.accountPageIndex();
				return
			} else {
				clearTimeout(this._scrollTimeObj);
				this._scrollTimeObj = setTimeout(function() {
					a.move(c, e)
				}, this.speed)
			}
		},
		pre: function() {
			if (this._state != "ready") {
				return
			}
			this._state = "stoping";
			this.move(-this.pageWidth)
		},
		next: function(a) {
			if (this._state != "ready") {
				return
			}
			this._state = "stoping";
			if (this.circularly) {
				this.move(this.pageWidth)
			} else {
				if (this.scDiv[this._scroll] >= this.lDiv01[this._sWidth] - this.frameWidth) {
					this._state = "ready";
					if (a) {
						this.pageTo(0)
					}
				} else {
					this.move(this.pageWidth)
				}
			}
		},
		play: function() {
			var a = this;
			if (!this.autoPlay) {
				return
			}
			clearInterval(this._autoTimeObj);
			this._autoTimeObj = setInterval(function() {
				a.next(true)
			}, this.autoPlayTime * 1000)
		},
		stop: function() {
			clearInterval(this._autoTimeObj)
		},
		pageTo: function(a) {
			if (this.pageIndex == a) {
				return
			}
			if (a < 0) {
				a = this.pageLength - 1
			}
			clearTimeout(this._scrollTimeObj);
			clearInterval(this._scrollTimeObj);
			this._state = "stoping";
			var b = a * this.frameWidth - this.scDiv[this._scroll];
			this.move(b, true)
		},
		accountPageIndex: function(d) {
			var b = Math.round(this.scDiv[this._scroll] / this.frameWidth);
			if (b >= this.pageLength) {
				b = 0
			}
			this.scrollLeft = this.scDiv[this._scroll];
			var a = this.lDiv01[this._sWidth] - this.frameWidth;
			if (!this.circularly) {
				this.eof = this.scrollLeft >= a;
				this.bof = this.scrollLeft <= 0
			}
			if (d == "end" && typeof(this.onmove) === "function") {
				this.onmove()
			}
			if (b == this.pageIndex) {
				return
			}
			this.pageIndex = b;
			if (this.pageIndex > Math.floor(this.lDiv01[this.upright ? "offsetHeight" : "offsetWidth"] / this.frameWidth)) {
				this.pageIndex = 0
			}
			var c;
			for (c = 0; c < this.dotObjArr.length; c++) {
				if (c == this.pageIndex) {
					this.dotObjArr[c].className = this.dotOnClassName
				} else {
					this.dotObjArr[c].className = this.dotClassName
				}
			}
			if (typeof(this.onpagechange) === "function") {
				this.onpagechange()
			}
		},
		iPadX: 0,
		iPadLastX: 0,
		iPadStatus: "ok",
		iPad: function() {
			if (typeof(window.ontouchstart) === "undefined") {
				return
			}
			if (!this.touch) {
				return
			}
			var a = this;
			this.addEvent(this.scDiv, "touchstart", function(b) {
				a._touchstart(b)
			});
			this.addEvent(this.scDiv, "touchmove", function(b) {
				a._touchmove(b)
			});
			this.addEvent(this.scDiv, "touchend", function(b) {
				a._touchend(b)
			})
		},
		_touchstart: function(a) {
			this.stop();
			this.iPadX = a.touches[0].pageX;
			this.iPadScrollX = window.pageXOffset;
			this.iPadScrollY = window.pageYOffset;
			this.scDivScrollLeft = this.scDiv[this._scroll]
		},
		_touchmove: function(b) {
			if (b.touches.length > 1) {
				this._touchend()
			}
			this.iPadLastX = b.touches[0].pageX;
			var c = this.iPadX - this.iPadLastX;
			if (this.iPadStatus == "ok") {
				if (this.iPadScrollY == window.pageYOffset && this.iPadScrollX == window.pageXOffset && Math.abs(c) > 20) {
					this.iPadStatus = "touch"
				} else {
					return
				}
			}
			this._state = "touch";
			var a = this.scDivScrollLeft + c;
			if (a >= this.lDiv01[this._sWidth]) {
				if (this.circularly) {
					a = a - this.lDiv01[this._sWidth]
				} else {
					return
				}
			}
			if (a < 0) {
				if (this.circularly) {
					a = a + this.lDiv01[this._sWidth]
				} else {
					return
				}
			}
			this.scDiv[this._scroll] = a;
			b.preventDefault()
		},
		_touchend: function(a) {
			if (this.iPadStatus != "touch") {
				return
			}
			this.iPadStatus = "ok";
			var b = this.iPadX - this.iPadLastX;
			if (b < 0) {
				this.rightEnd()
			} else {
				this.leftEnd()
			}
			this.play()
		},
		_overTouch: function() {
			this.iPadStatus = "ok"
		},
		$: function(objName) {
			if (document.getElementById) {
				return eval('document.getElementById("' + objName + '")')
			} else {
				return eval("document.all." + objName)
			}
		},
		isIE: navigator.appVersion.indexOf("MSIE") != -1 ? true : false,
		addEvent: function(c, a, b) {
			if (c.attachEvent) {
				c.attachEvent("on" + a, b)
			} else {
				c.addEventListener(a, b, false)
			}
		},
		delEvent: function(c, a, b) {
			if (c.detachEvent) {
				c.detachEvent("on" + a, b)
			} else {
				c.removeEventListener(a, b, false)
			}
		},
		preventDefault: function(a) {
			if (a.preventDefault) {
				a.preventDefault()
			} else {
				a.returnValue = false
			}
		}
	};

	/***** code by perkyliu@126.com *****/
	exports.initPageBanner=function() {
		var focusScroll = new ScrollPic();
		focusScroll.scrollContId = "page-banner"; //内容容器ID
		focusScroll.dotClassName = ""; //点className
		focusScroll.dotOnClassName = "cur"; //当前点className
		focusScroll.listType = ""; //列表类型(number:数字，其它为空)
		focusScroll.listEvent = "onmouseover"; //切换事件
		focusScroll.frameWidth = 494; //显示框宽度
		focusScroll.pageWidth = 494; //翻页宽度
		focusScroll.upright = false; //垂直滚动
		focusScroll.speed = 10; //移动速度(单位毫秒，越小越快)
		focusScroll.space = 40; //每次移动像素(单位px，越大越快)
		focusScroll.autoPlay = true; //自动播放
		focusScroll.autoPlayTime = 5; //自动播放间隔时间(秒)
		focusScroll.circularly = true;
		focusScroll.initialize(); //初始化

		$('#page-btn-prev').click(function() {
			focusScroll.pre();
			return false;
		})

		$('#page-btn-next').click(function() {
			focusScroll.next();
			return false;
		})
	}


});