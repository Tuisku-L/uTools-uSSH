import React from "react";
import * as Services from "@/utils/uToolsDb";

import { Button, Col, Divider, Empty, Row, Modal, Spin, message, Input } from "antd";
import CreateHost from "@/components/CreateHost";
import HostCard from "@/components/HostCard";

import { Host, Group } from "@/@types/entities";

interface IProps {
    groupId: string;
}

interface IState {
    hosts: Array<Host>;
    modalDisplay: boolean;
    editHost: Host | undefined;
    group: Group | null;
}

export default class HostList extends React.Component<IProps, IState>{
    pwdInput: any = null;
    constructor(props: IProps) {
        super(props);
        this.state = {
            hosts: [],
            modalDisplay: false,
            editHost: undefined,
            group: null
        };
    }

    componentDidMount = () => {
        this.actionInit(this.props.groupId);
    }

    UNSAFE_componentWillReceiveProps = (nextProps: IProps) => {
        if (nextProps.groupId !== this.props.groupId) {
            this.actionInit(nextProps.groupId);
        }
    }

    actionInit = (groupId: string) => {
        const group = Services.GetGroup(groupId);
        if (group) {
            this.setState({
                group
            }, () => {
                if (group.password && group.password !== "") {
                    Modal.warning({
                        title: "请输入分组查看密码",
                        content: <div style={{ padding: "1em 0" }}>
                            <Input.Password ref={ref => this.pwdInput = ref} />
                        </div>,
                        onOk: () => {
                            const pwd = this.pwdInput.state.value;
                            if (pwd && pwd !== "") {
                                if (pwd === group.password) {
                                    this.actionGetHostByGroupId(groupId);
                                    return Promise.resolve(null);
                                } else {
                                    return Promise.reject(message.warning("密码错误", 1.5));
                                }
                            } else {
                                return Promise.reject(message.warning("请输入密码", 1.5));
                            }
                        }
                    });
                } else {
                    this.actionGetHostByGroupId(groupId);
                }
            });
        }
    }

    actionGetHostByGroupId = (groupId: string) => {
        let hosts: Array<Host> = [];
        if (groupId.includes("group|fixed")) {
            hosts = Services.getFixedHosts();
        } else {
            hosts = Services.GetHostsByGroupId(groupId);
        }
        this.setState({
            hosts
        });
    }

    actionCreateOrUpdateFinish = () => {
        this.setState({
            modalDisplay: false
        }, () => {
            this.actionGetHostByGroupId(this.props.groupId);
        });
    }

    actionOnEdit = (host: Host) => {
        this.setState({
            editHost: host,
            modalDisplay: true
        });
    }

    actionOnRemove = (hostId: string) => {
        Modal.confirm({
            title: "提示",
            content: "是否确认删除此服务器",
            onOk: () => {
                const result = Services.removeHost(hostId);
                if (result) {
                    this.actionGetHostByGroupId(this.props.groupId);
                    return Promise.resolve(message.success("删除成功", 1.5));
                } else {
                    return Promise.reject(message.warn("删除失败", 1.5));
                }
            }
        })
    }

    actionOnFixedChange = (host: Host) => {
        host.isFixed = !host.isFixed;
        const result = Services.createOrUpdateHost(host);
        if (result) {
            if (host.isFixed) {
                Services.addFixed(host._id);
            } else {
                Services.removeFixed(host._id);
            }

            message.success("操作成功", 1.5);
            this.actionGetHostByGroupId(this.props.groupId);
        } else {
            message.error("操作失败", 1.5);
        }
    }

    public render = () => {
        const { group, hosts, modalDisplay, editHost } = this.state;

        if (!group) {
            return <Spin />;
        }

        return <div>
            <Row>
                <Col span={20}>
                    <div style={{ fontSize: "1.3em" }}>{group.name}</div>
                </Col>
                {
                    !group._id.includes("group|fixed") &&
                    <Col span={4} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            onClick={() => this.setState({ modalDisplay: true })}
                        >
                            添加服务器
                    </Button>
                    </Col>
                }
            </Row>
            <Divider style={{ margin: "1em auto" }} />
            <div>
                {
                    hosts.length > 0 ?
                        <Row gutter={16}>
                            {
                                hosts.map(host =>
                                    <Col span={8} key={host._id} style={{ marginBottom: "1em" }}>
                                        <HostCard
                                            host={host}
                                            onEdit={() => this.actionOnEdit(host)}
                                            onRemove={this.actionOnRemove}
                                            onFixedChange={this.actionOnFixedChange}
                                            actionBar={!group._id.includes("group|fixed")}
                                        />
                                    </Col>
                                )
                            }
                        </Row> :
                        <Empty description="暂无服务器" />
                }
            </div>
            <Modal
                visible={modalDisplay}
                title={editHost ? "编辑服务器" : "添加服务器"}
                onCancel={() => this.setState({ modalDisplay: false, editHost: undefined })}
                footer={false}
                destroyOnClose
                centered
            >
                {
                    modalDisplay &&
                    <CreateHost
                        groupId={this.props.groupId}
                        onFinish={this.actionCreateOrUpdateFinish}
                        editHost={editHost}
                    />
                }
            </Modal>
        </div>;
    }
}
