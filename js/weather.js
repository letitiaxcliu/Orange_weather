$(function () {

    // 天气图标数据
    var weaIcons = {
        qing: {
            title: '晴',
            icon: '&#xe9b7;'
        },
        yun: {
            title: '多云',
            icon: '&#xe9ba;'
        },
        yin: {
            title: '阴天',
            icon: '&#xe9ba;'
        },
        lei: {
            title: '雷阵雨',
            icon: '&#xe9b3;'
        },
        yu: {
            title: '小雨',
            icon: '&#xe9b3;'
        },
        //未知天气的默认图标
        default: {
            title: '未知',
            icon: ''
        }
    }

    // 获取天气数据
    function getWeatherData(city) {

        var data = {
            appid: '99896829 ',
            appsecret: 'dU2ZGAxw',
            version: 'v6',
        };
        if (city !== undefined) {
            data.city = city;
        }

        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api',
            data: data,
            dataType: 'jsonp',
            success: function (data) {
                console.log(data);
                $('.city-city').text(data.city); //获取定位位置

                // 绑定实况天气数据
                var weaData = ['date', 'week', 'tem', 'tem1', 'tem2', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];

                for (var i = 0; i < weaData.length; i++) {

                    if (weaData[i] == 'tem1') {
                        $('.' + weaData[i]).text(weaData[i] = data[weaData[i]] + '℃');

                    } else if (weaData[i] == 'tem2') {
                        $('.' + weaData[i]).text(weaData[i] = data[weaData[i]] + '℃');

                    } else {
                        $('.' + weaData[i]).text(weaData[i] === 'tem' ? data[weaData[i]] + '℃' : data[weaData[i]]);
                    }

                }

                // 获取24小时天气和未来6天天气
                var otherData = {
                    appid: '99896829 ',
                    appsecret: 'dU2ZGAxw',
                    version: 'v9',
                };

                if (city != undefined) {
                    otherData.city = city;
                }

                $.ajax({
                    type: 'GET',
                    url: 'https://www.tianqiapi.com/api',
                    data: otherData,
                    dataType: 'jsonp',
                    success: function (result) {
                        // console.log('7天天气数据==>',result);

                        // 24小时天气数据
                        var hweaData = result.data[0].hours;
                        console.log('各时段天气情况 ==>', hweaData);

                        $.each(hweaData, function (i, v) {

                            var $li = $(` 
                            <li>
                            <div>
                               ${v.hours}
                            </div>
                            <div class="icon iconfont hwea-icon">
                                ${weaIcons[v.wea_img].icon}
                            </div>
                            <div>
                                ${v.tem + '℃'}
                            </div>
                        </li>`
                        );

                        // var $li = $(` 
                        //     <li>
                        //     <div>
                        //        ${v.hours}
                        //     </div>
                        //     <div>
                        //         ${v.tem + '℃'}
                        //     </div>
                        // </li>`
                        // );

                            $('#hoursWeather').append($li);
                        })

                        // 未来6天天气
                        var fweaData = result.data.slice(1);
                        console.log('未来6天天气',fweaData);

                        $.each(fweaData, function (i, v) {
                            var $li = $(`
                            <li>
                            <span class="date">
                                ${v.date}
                            </span>
                            <span class="icon iconfont fwea-icon">
                                ${weaIcons[v.wea_img].icon}
                            </span>
                            <span>
                            ${v.tem1 + '℃ ~' + v.tem2 + '℃'}
                            </span>
                        </li>
                            `);
                            $('#futureWeather').append($li);
                        })
                    }
                })
            }
        })
    }
    getWeatherData();

    // 城市天气搜索
    $('.search-icon').on('click',function(){

        var city = $('.search-inp').val();
        if(city == undefined || city.trim() == ''){
            return;
        }
        console.log('当前city === >',city);
        $('#hoursWeather,#futureWeather').empty();
        getWeatherData(city);
    })
})