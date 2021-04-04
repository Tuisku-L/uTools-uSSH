import React, { useState, useEffect } from "react";
import * as Services from "@/utils/uToolsDb";
import { Form, Input, Radio, Button, Row, Col, message, Spin } from "antd";
import { Host, LoginType } from "@/@types/entities";

const createHost = (props: { groupId: string, editHost?: Host, onFinish: Function }) => {
    const { editHost } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState(LoginType.Normal);
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.editHost) {
            setLoginType(props.editHost.loginType);
        }
    }, [props.editHost]);

    const onSubmit = (values: Host) => {
        values.createDate = Date.now();
        values.GroupId = props.groupId;
        values.sort = Number(values.sort);
        if (editHost) {
            values._rev = editHost._rev;
            values._id = editHost._id;
            values.isFixed = editHost.isFixed;
        } else {
            values._id = `host|${props.groupId}|${values.createDate}`;
            values.isFixed = false;
        }
        const result = Services.createOrUpdateHost(values);
        if (result) {
            message.success("操作成功", 1.5);
        } else {
            message.error("操作失败", 1.5);
        }
        props.onFinish && props.onFinish();
    }

    const actionChoosePemFile = () => {
        const file = window.utools.showOpenDialog({
            title: "请选择登录服务器使用的私钥文件",
            properties: ["openFile"],
            message: "为了你的服务器安全，私钥文件不会通过 uTools 进行同步。如果你需要在多台设备使用插件，请在每一台设备上重新设置私钥文件地址。"
        });

        if (file) {
            form.setFieldsValue({
                pemFile: file[0]
            });
        }
    }

    return <Spin spinning={isLoading}>
        <Form
            labelCol={{ span: 4 }}
            labelAlign="right"
            style={{ paddingTop: "1em" }}
            onFinish={onSubmit}
            form={form}
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
                initialValue={editHost ? editHost.port : "22"}
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
                    <Radio value={LoginType.Pem}>公钥验证</Radio>
                </Radio.Group>
            </Form.Item>
            {
                loginType === LoginType.Pem &&
                <Form.Item
                    label="私钥文件"
                    name="pemFile"
                    rules={[
                        {
                            required: true,
                            message: "请选择私钥文件"
                        }
                    ]}
                    initialValue={editHost ? editHost.pemFile : ""}
                    extra={<span style={{ fontSize: ".8em" }}>为了你的服务器安全，私钥文件不会通过 uTools 进行同步。如果你需要在多台设备使用插件，请在每一台设备上重新设置私钥文件地址。</span>}
                >
                    <Input readOnly placeholder="私钥文件" onClick={actionChoosePemFile} />
                </Form.Item>
            }
            <Form.Item style={{ textAlign: "center" }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100px" }}
                >
                    {editHost ? "确认修改" : "确认添加"}
                </Button>
            </Form.Item>
        </Form>
    </Spin>
};

export default createHost;
