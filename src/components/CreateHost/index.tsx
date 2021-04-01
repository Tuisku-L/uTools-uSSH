import React, { useState } from "react";
import * as Services from "@/utils/uToolsDb";
import { Form, Input, Radio, Button, Row, Col, message, Spin } from "antd";
import { Host, LoginType } from "@/@types/entities";

const createHost = (props: { groupId: string, editHost?: Host, onFinish: Function }) => {
    const { editHost } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState(LoginType.Normal);

    const onSubmit = (values: Host) => {
        values.createDate = Date.now();
        values.isFixed = false;
        values.GroupId = props.groupId;
        values._id = `host|${props.groupId}|${values.createDate}`;

        const result = Services.createOrUpdateHost(values);
        console.info("result", result)
        props.onFinish && props.onFinish();
    }

    return <Spin spinning={isLoading}>
        <Form
            labelCol={{ span: 4 }}
            labelAlign="right"
            style={{ paddingTop: "1em" }}
            onFinish={onSubmit}
        >
            <Form.Item
                label="名称"
                name="alias"
                initialValue={editHost ? editHost.alias : ""}
            >
                <Input placeholder="服务器名称" />
            </Form.Item>
            <Form.Item
                label="地址"
                name="address"
                rules={[
                    {
                        required: true,
                        message: "请输入正确的服务器 IP 或 URL 地址"
                    }
                ]}
                initialValue={editHost ? editHost.address : ""}
            >
                <Input placeholder="服务器 IP 或 URL 地址" />
            </Form.Item>
            <Form.Item
                label="用户"
                name="user"
                rules={[
                    {
                        required: true,
                        message: "请输入正确的用户名"
                    }
                ]}
                initialValue={editHost ? editHost.user : ""}
            >
                <Input placeholder="登录服务器的用户名" />
            </Form.Item>
            <Form.Item
                label="端口"
                name="port"
                rules={[
                    {
                        required: true,
                        message: "请输入正确的端口号"
                    }
                ]}
                initialValue={editHost ? editHost.port : ""}
            >
                <Input type="number" placeholder="服务器的 SSH 端口号" />
            </Form.Item>
            <Form.Item
                label="登录方式"
                name="loginType"
                rules={[
                    {
                        required: true,
                    }
                ]}
                initialValue={editHost ? editHost.loginType : LoginType.Normal}
            >
                <Radio.Group
                    onChange={e => setLoginType(e.target.value)}
                >
                    <Radio value={LoginType.Normal}>正常登陆</Radio>
                    <Radio value={LoginType.Pem}>密钥登录</Radio>
                </Radio.Group>
            </Form.Item>
            {
                loginType === LoginType.Pem &&
                <Form.Item
                    label="密钥文件"
                    name="pemFile"
                    rules={[
                        {
                            required: true,
                            message: "请选择密钥文件"
                        }
                    ]}
                    initialValue={editHost ? editHost.pemFile : ""}
                >
                    <Input readOnly disabled placeholder="密钥文件" />
                </Form.Item>
            }
            <Form.Item style={{ textAlign: "center" }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100px" }}
                >
                    确认添加
                </Button>
            </Form.Item>
        </Form>
    </Spin>
};

export default createHost;
