import httpInstance from "@/utlis/http";
//获取温度实时数据
export const GetTemperatureAPI = () => {
    return httpInstance({
        url: '/temp',
        method:'get'
    })
}
//获取湿度实时数据
export const GetHumidityAPI = () => {
    return httpInstance({
        url: '/humi',
        method: 'get'
    })
}
//获取电压实时数据
export const GetVoltageAPI = () => {
    return httpInstance({
        url: '/volt',
        method: 'get'
    })
}
//获取烟雾实时数据
export const GetSmogAPI = () => {
    return httpInstance({
        url: '/smog',
        method: 'get'
    })
}
//获取设备信息实时数据
export const GetDeviceAPI = () => {
    return httpInstance({
        url: '/device',
        method: 'get'
    })
}