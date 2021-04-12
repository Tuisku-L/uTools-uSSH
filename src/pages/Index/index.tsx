import React from "react";
import linq from "linq";
import { Button, Col, Layout, Menu, Row, Modal, message, Input, Spin, Radio } from 'antd';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import HostList from "@/components/HostList";
import CreateGroup from "@/components/CreateGroup";

import * as Services from "@/utils/uToolsDb";
import { Group, Host } from "@/@types/entities";

import styles from "./styles.less";

interface IProps {

}

interface IState {
    isInit: boolean;
    groups: Array<Group>;
    currentGroup: string;
    modalDisplay: boolean;
    editGroup: Group | undefined;
    terminalType: "Terminal" | "iTerm" | "cmd" | "PowerShell" | null;
}

export default class Index extends React.Component<IProps, IState>{
    pwdInput: any;
    radioType: any;
    constructor(props: IProps) {
        super(props);
        this.state = {
            isInit: false,
            groups: [],
            currentGroup: "",
            modalDisplay: false,
            editGroup: undefined,
            terminalType: null
        };
    }

    componentDidMount = () => {
        // this.actionInitDefaultGroup();
        window.utools.onPluginReady(() => {
            this.setState({
                isInit: true
            }, () => {
                this.actionInitDefaultGroup();
            });
        });
    }

    actionInitDefaultGroup = () => {
        const group = Services.GetGroup("group|fixed");
        if (!group) {
            Services.createOrUpdateGroup({
                _id: "group|fixed",
                name: "常用",
                password: "",
                sort: -1,
                createDate: Date.now()
            });
        }

        this.setState({
            currentGroup: "group|fixed"
        }, () => {
            this.actionGetGroup();
            const type = Services.getTerminalType();
            window.terminalType = type;
            this.setState({
                terminalType: type
            });
        });
    }

    actionGetGroup = () => {
        let groups = Services.GetGroups();
        groups = linq.from(groups).orderBy(x => x.sort).toArray();
        this.setState({
            groups,
            modalDisplay: false
        });
    }

    actionOnPwdAction = (group: Group, cb: Function) => {
        if (group.password && group.password !== "") {
            Modal.warning({
                title: "操作前请输入分组查看密码",
                content: <div style={{ padding: "1em 0" }}>
                    <Input.Password ref={ref => this.pwdInput = ref} />
                </div>,
                closable: true,
                onOk: () => {
                    const pwd = this.pwdInput.state.value;
                    if (pwd && pwd !== "") {
                        if (pwd === group.password) {
                            return Promise.resolve(cb());
                        } else {
                            return Promise.reject(message.warning("密码错误", 1.5));
                        }
                    } else {
                        return Promise.reject(message.warning("请输入密码", 1.5));
                    }
                }
            });
        } else {
            cb();
        }
    }

    actionGlolbalSetting = () => {
        Modal.info({
            title: null,
            icon: null,
            closable: true,
            maskClosable: false,
            okButtonProps: { style: { display: "none" } },
            width: 300,
            content: <div>
                <div>终端类型：</div><br />
                <div>
                    <Radio.Group
                        defaultValue={window.terminalType}
                        onChange={e => this.setState({ terminalType: e.target.value })}
                    >
                        {
                            window.utools.isMacOs() ?
                                <>
                                    <Radio value="Terminal">Terminal</Radio>
                                    <Radio value="iTerm">iTerm</Radio>
                                </> :
                                window.utools.isWindows() ?
                                    <>
                                        <Radio value="cmd">CMD</Radio>
                                        <Radio value="PowerShell">PowerShell</Radio>
                                    </> : null
                        }
                    </Radio.Group >
                </div><br />
                <div>
                    <Button
                        size="small"
                        type="primary"
                        onClick={() => {
                            const { terminalType } = this.state;
                            if (terminalType) {
                                const result = Services.changeTerminalType(terminalType);
                                if (result) {
                                    window.terminalType = terminalType;
                                    message.success("设置成功", 1.5);
                                    Modal.destroyAll();
                                } else {
                                    message.error("操作失败", 1.5);
                                }
                            }
                        }}
                    >
                        保存
                    </Button>
                </div>
            </div >
        });
    }

    public render = () => {
        const { isInit, groups, currentGroup, modalDisplay, editGroup } = this.state;

        if (!isInit) {
            return <Spin />;
        }

        return (
            <Layout style={{ minHeight: "100%", maxHeight: "100%" }}>
                <Layout.Sider theme="light">
                    <div style={{ padding: "1em" }}>
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            onClick={() => this.setState({ modalDisplay: true })}
                        >
                            添加分组
                        </Button>
                    </div>
                    <div>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={["group|fixed"]}
                            onClick={menu => {
                                this.setState({
                                    currentGroup: menu.key.toString()
                                })
                            }}
                            selectedKeys={[currentGroup]}
                        >
                            {
                                groups.map(group =>
                                    <Menu.Item key={group._id}>
                                        <div className={styles.groupLine}>
                                            <Row>
                                                <Col span={18} className={styles.text} title={group.name}>
                                                    {group.name}
                                                </Col>
                                                {
                                                    !group._id.includes("group|fixed") &&
                                                    <Col span={6} className={styles.actionBox}>
                                                        <EditOutlined
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.actionOnPwdAction(group, () => this.setState({ modalDisplay: true, editGroup: group }));
                                                            }}
                                                        />
                                                        <DeleteOutlined
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.actionOnPwdAction(group, () => {
                                                                    Modal.confirm({
                                                                        title: "提示",
                                                                        content: `是否确认删除分组 ${group.name}，分组下的服务器也将一并删除。`,
                                                                        onOk: () => {
                                                                            const result = Services.removeGroup(group._id);
                                                                            if (result) {
                                                                                this.actionInitDefaultGroup();
                                                                                this.setState({
                                                                                    currentGroup: "group|fixed"
                                                                                }, () => {
                                                                                    return Promise.resolve(message.success("删除成功", 1.5));
                                                                                });
                                                                            } else {
                                                                                return Promise.reject(message.error("删除失败", 1.5));
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                            }}
                                                        />
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
                                    </Menu.Item>
                                )
                            }
                        </Menu>
                    </div>
                    <div style={{ padding: "1em", position: "absolute", width: "100%", bottom: 0 }}>
                        <Button
                            style={{ width: "100%" }}
                            onClick={this.actionGlolbalSetting}
                        >
                            全局设置
                        </Button>
                    </div>
                </Layout.Sider>
                <Layout>
                    <Layout.Content style={{ maxHeight: "100%" }}>
                        {
                            currentGroup && currentGroup !== "" &&
                            <div style={{ padding: "1em", maxHeight: "100%", overflowX: "hidden", overflowY: "auto" }}>
                                <HostList groupId={currentGroup} />
                            </div>
                        }
                    </Layout.Content>
                </Layout>
                <Modal
                    title={editGroup ? "编辑分组" : "添加分组"}
                    visible={modalDisplay}
                    footer={null}
                    destroyOnClose
                    onCancel={() => this.setState({ modalDisplay: false, editGroup: undefined })}
                    width={450}
                >
                    <CreateGroup
                        editGroup={editGroup}
                        onFinish={this.actionInitDefaultGroup}
                    />
                </Modal>
            </Layout>
        );
    }
}
